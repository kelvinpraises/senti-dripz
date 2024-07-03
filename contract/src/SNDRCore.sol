// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {INFTDriver} from "./interface/INFTDriver.sol";
import {IDrips} from "./interface/IDrips.sol";
import {ISNDRNFT} from "./interface/ISNDRNFT.sol";
import {StreamConfigImpl} from "./StreamConfig.sol";

/**
 * @title SNDRCore
 * @dev Core contract for managing SNDR (Senti Dripz) functionality, integrating with Drips protocol
 */
contract SNDRCore is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Must match Drips.AMT_PER_SEC_MULTIPLIER
    uint160 private constant AMT_PER_SEC_MULTIPLIER = 1_000_000_000;
    INFTDriver public nftDriver;
    IDrips public dripsContract;
    ISNDRNFT public sndrNFT;

    mapping(uint256 => uint256) public poolIdToDripsAccount;
    mapping(uint256 => uint256) public sndrNftToDripsAccount;

    // Mapping to store SNDR NFTs for each pool
    mapping(uint256 => mapping(uint256 => bool)) public poolIdToSNDRNFTs;
    // Mapping to store whitelisted collectors for each pool
    mapping(uint256 => mapping(address => bool)) public poolIdToWhitelistedCollectors;
    // Mapping to track if a pool has any whitelisted collectors
    mapping(uint256 => bool) public poolHasWhitelistedCollectors;

    /**
     * @dev Emitted when a stream is set up and an NFT is minted
     * @param poolId Unique identifier for the pool
     * @param token ERC20 token being distributed
     * @param recipient Address of the recipient
     * @param recipientDriverAccountId Drips account ID associated with the recipient
     * @param sndrNftId ID of the minted SNDR NFT
     * @param amountPerSecond Amount streamed per second
     * @param duration Total duration of the stream in seconds
     * @param totalAllocation Total amount allocated to this recipient
     */
    event StreamSetup(
        uint256 indexed poolId,
        IERC20 token,
        address indexed recipient,
        uint256 indexed recipientDriverAccountId,
        uint256 sndrNftId,
        uint256 amountPerSecond,
        uint256 duration,
        uint256 totalAllocation
    );
    event DistributionHandled(uint256 indexed poolId, IERC20 indexed token);
    event FundsTransferred(uint256 indexed poolId, uint256 indexed sndrNftId, address indexed recipient, uint256 amount);
    event WhitelistedCollectorUpdated(uint256 indexed poolId, address indexed collector, bool isWhitelisted);

    /**
     * @dev Constructor to initialize the contract with necessary addresses
     * @param _nftDriverAddress Address of the NFTDriver contract
     * @param _dripsContract Address of the Drips contract
     * @param _sndrNFTAddress Address of the SNDRNFT contract
     */
    constructor(address _nftDriverAddress, address _dripsContract, address _sndrNFTAddress) {
        nftDriver = INFTDriver(_nftDriverAddress);
        dripsContract = IDrips(_dripsContract);
        sndrNFT = ISNDRNFT(_sndrNFTAddress);
    }

    /**
     * @dev Handles the distribution of tokens to multiple recipients
     * @param poolId Unique identifier for the pool
     * @param token ERC20 token being distributed
     * @param recipients Array of recipient addresses
     * @param allocations Array of allocation amounts for each recipient
     * @param duration Total duration of the stream in seconds
     */
    function handleDistribution(
        uint256 poolId,
        IERC20 token,
        address[] memory recipients,
        uint256[] memory allocations,
        uint256 duration,
        address[] memory whitelistedCollectors
    ) external nonReentrant {
        // TODO: let it do a transfer from the strategy
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == allocations.length, "Mismatched recipients and allocations");

        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAllocation += allocations[i];
        }

        uint256 balance = token.balanceOf(address(this));
        require(balance >= totalAllocation, "Insufficient balance for distribution");

        // Mint a Drips NFT stream account for the pool funds
        uint256 poolDriverAccountId = nftDriver.mint(address(this), noMetadata());
        poolIdToDripsAccount[poolId] = poolDriverAccountId;

        INFTDriver.StreamReceiver[] memory receivers = new INFTDriver.StreamReceiver[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 allocation = allocations[i];
            uint256 amountPerSecond = (allocation * AMT_PER_SEC_MULTIPLIER) / duration;

            // Mint a Drips NFT funds account for the recipient funds
            uint256 recipientDriverAccountId = nftDriver.mint(address(this), noMetadata());

            // Mint a SNDR NFT and send to recipient as proof of funds account ownership
            uint256 sndrNftId = sndrNFT.safeMint(recipient, "");
            sndrNftToDripsAccount[sndrNftId] = recipientDriverAccountId;

            // Add SNDR NFT to the pool's mapping
            poolIdToSNDRNFTs[poolId][sndrNftId] = true;

            // Add recipient address and stream configuration
            receivers[i] = INFTDriver.StreamReceiver(recipientDriverAccountId, StreamConfigImpl.create(0, uint160(amountPerSecond), 0, 0));

            emit StreamSetup(
                poolId,
                token,
                recipient,
                recipientDriverAccountId,
                sndrNftId,
                amountPerSecond,
                duration,
                allocation
            );
        }

        // Set stream from pool fund to recipients
        nftDriver.setStreams(
            poolDriverAccountId,
            address(token),
            new INFTDriver.StreamReceiver[](0),
            int128(int256(totalAllocation)),
            receivers,
            0,
            0,
            address(this)
        );

        for (uint256 i = 0; i < whitelistedCollectors.length; i++) {
            updateWhitelistedCollector(poolId, whitelistedCollectors[i], true);
        }

        emit DistributionHandled(poolId, token);
    }

    /**
     * @dev Transfers funds from an SNDR NFT to a recipient
     * @param poolId ID of the pool
     * @param sndrNftId ID of the SNDR NFT
     * @param recipient Address of the recipient
     * @param amount Amount to transfer
     * @param token ERC20 token to transfer
     */
    function transfer(
        uint256 poolId,
        uint256 sndrNftId,
        address recipient,
        uint256 amount,
        IERC20 token
    ) external nonReentrant {
        require(sndrNFT.ownerOf(sndrNftId) == msg.sender, "Caller is not the owner of the SNDR NFT");
        uint256 dripsAccountId = sndrNftToDripsAccount[sndrNftId];
        require(dripsAccountId != 0, "No Drips account associated with this SNDR NFT");

        // Check if the transfer is valid based on whitelisting rules
        require(isValidTransfer(poolId, sndrNftId, recipient), "Transfer not allowed");

        (uint128 amountToSplit, uint128 amountToCollect) = calculateTransferAmounts(dripsAccountId, token, amount);

        if (amountToSplit > 0) {
            (uint128 splitAmount, ) = dripsContract.split(dripsAccountId, address(token), new IDrips.SplitsReceiver[](0));
            require(splitAmount >= amountToSplit, "Split amount less than expected");
        }

        uint128 collected = nftDriver.collect(dripsAccountId, address(token), address(this));
        require(collected >= amountToCollect, "Collected amount less than requested transfer amount");

        token.safeTransfer(recipient, amount);
        emit FundsTransferred(poolId, sndrNftId, recipient, amount);
    }

    /**
     * @dev Checks if a transfer is valid based on whitelisting rules
     * @param poolId ID of the pool
     * @param sndrNftId ID of the SNDR NFT
     * @param recipient Address of the recipient
     * @return bool indicating if the transfer is valid
     */
    function isValidTransfer(uint256 poolId, uint256 sndrNftId, address recipient) internal view returns (bool) {
        // Check if the NFT belongs to the pool
        bool isNFTInPool = poolIdToSNDRNFTs[poolId][sndrNftId];

        // If there are no whitelisted collectors, only check if the NFT is in the pool
        if (!poolHasWhitelistedCollectors[poolId]) {
            return isNFTInPool;
        }

        // Check if the recipient is whitelisted
        bool isRecipientWhitelisted = poolIdToWhitelistedCollectors[poolId][recipient];

        // Transfer is valid if the NFT is in the pool and the recipient is whitelisted
        return isNFTInPool && isRecipientWhitelisted;
    }

    /**
     * @dev Updates the whitelist status of a collector for a specific pool
     * @param poolId ID of the pool
     * @param collector Address of the collector
     * @param isWhitelisted Boolean indicating whether the collector should be whitelisted
     */
    function updateWhitelistedCollector(uint256 poolId, address collector, bool isWhitelisted) internal {
        // TODO: Add access control
        poolIdToWhitelistedCollectors[poolId][collector] = isWhitelisted;

        if (isWhitelisted) {
            poolHasWhitelistedCollectors[poolId] = true;
        } else {
            // Check if there are any remaining whitelisted collectors
            // This could be gas-intensive for large numbers of collectors
            // Consider alternative implementations if this becomes an issue
            bool hasWhitelisted = false;
            for (uint i = 0; i < type(uint256).max; i++) {
                address potentialCollector = address(uint160(i));
                if (poolIdToWhitelistedCollectors[poolId][potentialCollector]) {
                    hasWhitelisted = true;
                    break;
                }
            }
            poolHasWhitelistedCollectors[poolId] = hasWhitelisted;
        }

        emit WhitelistedCollectorUpdated(poolId, collector, isWhitelisted);
    }

    /**
     * @dev Calculates the amounts to split and collect for a transfer
     * @param dripsAccountId ID of the Drips account
     * @param token ERC20 token to transfer
     * @param amount Amount to transfer
     * @return amountToSplit Amount that needs to be split
     * @return amountToCollect Amount that needs to be collected
     */
    function calculateTransferAmounts(uint256 dripsAccountId, IERC20 token, uint256 amount)
        public view returns (uint128 amountToSplit, uint128 amountToCollect)
    {
        uint128 splittableAmount = dripsContract.splittable(dripsAccountId, address(token));
        uint128 collectableAmount = dripsContract.collectable(dripsAccountId, address(token));
        uint256 totalAvailable = uint256(splittableAmount) + uint256(collectableAmount);

        require(totalAvailable >= amount, "Insufficient available funds");

        if (collectableAmount >= amount) {
            amountToCollect = uint128(amount);
        } else {
            amountToSplit = uint128(amount - collectableAmount);
            amountToCollect = uint128(amount);
        }
    }

    /**
     * @dev Receives streams for an SNDR NFT
     * @param sndrNftId ID of the SNDR NFT
     * @param token ERC20 token of the stream
     * @param maxCycles Maximum number of cycles to receive
     */
    function receiveStreams(uint256 sndrNftId, IERC20 token, uint32 maxCycles) external nonReentrant {
        require(sndrNFT.ownerOf(sndrNftId) == msg.sender, "Caller is not the owner of the SNDR NFT");
        uint256 dripsAccountId = sndrNftToDripsAccount[sndrNftId];
        require(dripsAccountId != 0, "No Drips account associated with this SNDR NFT");

        dripsContract.receiveStreams(dripsAccountId, address(token), maxCycles);
    }

    /**
     * @dev Calculates receivable streams for an SNDR NFT
     * @param sndrNftId ID of the SNDR NFT
     * @param token ERC20 token of the stream
     * @param maxCycles Maximum number of cycles to calculate
     * @return receivableAmt Amount that can be received
     */
    function calculateReceivableStreams(uint256 sndrNftId, IERC20 token, uint32 maxCycles)
        external view returns (uint128 receivableAmt)
    {
        uint256 dripsAccountId = sndrNftToDripsAccount[sndrNftId];
        require(dripsAccountId != 0, "No Drips account associated with this SNDR NFT");
        return dripsContract.receiveStreamsResult(dripsAccountId, address(token), maxCycles);
    }

    /**
     * @dev Squeezes streams for an SNDR NFT
     * @param sndrNftId ID of the SNDR NFT
     * @param token ERC20 token of the stream
     * @param senderId ID of the sender account
     * @param historyHash Hash of the sender's streams history
     * @param streamsHistory Array of the sender's streams history
     */
    function squeezeStreams(
        uint256 sndrNftId,
        IERC20 token,
        uint256 senderId,
        bytes32 historyHash,
        IDrips.StreamsHistory[] memory streamsHistory
    ) external nonReentrant {
        require(sndrNFT.ownerOf(sndrNftId) == msg.sender, "Caller is not the owner of the SNDR NFT");
        uint256 dripsAccountId = sndrNftToDripsAccount[sndrNftId];
        require(dripsAccountId != 0, "No Drips account associated with this SNDR NFT");

        dripsContract.squeezeStreams(dripsAccountId, address(token), senderId, historyHash, streamsHistory);
    }

    /**
    * @dev Gets the stream configuration for a specific pool and recipient
    * @param poolId ID of the pool
    * @param token ERC20 token of the stream
    * @param recipient Address of the recipient
    * @return startTime Start time of the stream
    * @return stopTime Stop time of the stream
    * @return amountPerSecond Amount streamed per second
    */
    function getStreamConfig(uint256 poolId, IERC20 token, address recipient)
        external view returns (uint256 startTime, uint256 stopTime, uint256 amountPerSecond)
    {
        // uint256 senderAccountId = poolIdToDripsAccount[poolId];
        // uint256 receiverAccountId = sndrNftToDripsAccount[sndrNFT.tokenOfOwnerByIndex(recipient, 0)];

        // (bytes32 streamsHash, , uint32 updateTime, uint128 balance, uint32 maxEnd) = nftDriver.streamsState(senderAccountId, token);
        // IDrips.StreamReceiver[] memory receivers = abi.decode(abi.encodePacked(streamsHash), (IDrips.StreamReceiver[]));

        // for (uint256 i = 0; i < receivers.length; i++) {
        //     if (receivers[i].accountId == receiverAccountId) {
        //         (uint32 start, uint160 amtPerSec) = StreamConfigImpl.getConfig(receivers[i].config);
        //         return (updateTime, maxEnd, uint256(amtPerSec));
        //     }
        // }

        // revert("Stream not found");
    }

    /**
    * @dev Gets the available balance for an SNDR NFT
    * @param sndrNftId ID of the SNDR NFT
    * @param token ERC20 token to check balance for
    * @return Available balance
    */
    function getAvailableBalance(uint256 sndrNftId, IERC20 token) external view returns (uint256) {
        uint256 dripsAccountId = sndrNftToDripsAccount[sndrNftId];
        require(dripsAccountId != 0, "No Drips account associated with this SNDR NFT");
        return dripsContract.balanceAt(dripsAccountId, address(token), new IDrips.StreamReceiver[](0), uint32(block.timestamp));
    }

    /**
    * @dev Helper function to create empty metadata
    * @return accountMetadata Empty array of AccountMetadata
    */
    function noMetadata() internal pure returns (INFTDriver.AccountMetadata[] memory accountMetadata) {
        accountMetadata = new INFTDriver.AccountMetadata[](0);
    }
}
