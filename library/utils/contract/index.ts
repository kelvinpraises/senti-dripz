import {
  CallData,
  Contract,
  RpcProvider,
  shortString,
  uint256,
} from "starknet";

const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });

function bigIntToHex(value: bigint | undefined): string {
  if (value === undefined) return "0x0";
  return "0x" + value.toString(16).padStart(64, "0");
}

function bigIntToDecimalString(value: bigint | undefined): string {
  if (value === undefined) return "0";
  return value.toString();
}

function processCairoOption(option: { Some: any; None: boolean }): any {
  if (option.None) return null;
  if (Array.isArray(option.Some)) {
    return [bigIntToHex(option.Some[0]), bigIntToDecimalString(option.Some[1])];
  }
  return bigIntToHex(option.Some);
}

// Updated generic function to fetch contract data
export async function fetchContractData<T>(
  contractAddress: string,
  functionName: string,
  args: any[],
  processor: (rawData: any) => T
): Promise<T> {
  const provider = new RpcProvider({
    nodeUrl:
      process.env.STARKNET_RPC_URL ||
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/vEVKURyIJBdxxahH6eQJOSpjtIe3kA6-",
  });

  const { abi } = await provider.getClassAt(contractAddress);
  if (abi === undefined) {
    throw new Error("No ABI found for the given contract address.");
  }

  const contract = new Contract(abi, contractAddress, provider);

  if (!(functionName in contract.functions)) {
    throw new Error(`Function ${functionName} not found in contract ABI.`);
  }

  // Use CallData.compile to properly format the arguments
  const calldata = CallData.compile(args);
  const rawData = await contract.call(functionName, calldata);
  return processor(rawData);
}

// Example usage for getInstanceDetails
interface Instance {
  id: number;
  initiator: string;
  initiator_erc20: string;
  initiator_amount: string;
  counter_party_erc20: string;
  counter_party_amount: string;
  state: number;
  gating: {
    gated_account: string;
    in_collection: string | null;
    min_balance: [string, string] | null;
    token_id: [string, string] | null;
  };
}

export async function getInstanceDetails(
  contractAddress: string,
  id: number
): Promise<Instance> {
  return fetchContractData<Instance>(
    contractAddress,
    "find_instance",
    [id],
    (rawInstance) => ({
      id: Number(rawInstance.id),
      initiator: bigIntToHex(rawInstance.initiator),
      initiator_erc20: bigIntToHex(rawInstance.initiator_erc20),
      initiator_amount: bigIntToDecimalString(rawInstance.initiator_amount),
      counter_party_erc20: bigIntToHex(rawInstance.counter_party_erc20),
      counter_party_amount: bigIntToDecimalString(
        rawInstance.counter_party_amount
      ),
      state: Number(rawInstance.state),
      gating: {
        gated_account: bigIntToHex(rawInstance.gating.gated_account),
        in_collection: processCairoOption(rawInstance.gating.in_collection),
        min_balance: processCairoOption(rawInstance.gating.min_balance),
        token_id: processCairoOption(rawInstance.gating.token_id),
      },
    })
  );
}

export async function getERC20Details(tokenAddress: string) {
  const { abi } = await provider.getClassAt(tokenAddress);

  const contract = new Contract(abi, tokenAddress, provider);

  const [name, symbol] = await Promise.all([
    contract.call("name"),
    contract.call("symbol"),
  ]);

  name.toString();
  symbol;

  return {
    name: shortString.decodeShortString(name.toString()),
    symbol: shortString.decodeShortString(symbol.toString()),
  };
}

export async function checkIfOwnsToken(
  userAddress: string,
  collectionAddress: string
) {
  const contract = new Contract(["ERC721_ABI"], collectionAddress, provider);
  try {
    const balance = await contract.balanceOf(userAddress);
    return uint256.uint256ToBN(balance) > 0;
  } catch (error) {
    console.error("Error checking token ownership:", error);
    throw error;
  }
}

export async function checkBalance(userAddress: string, tokenAddress: string) {
  const contract = new Contract(["ERC20_ABI"], tokenAddress, provider);
  try {
    const balance = await contract.balanceOf(userAddress);
    return uint256.uint256ToBN(balance);
  } catch (error) {
    console.error("Error checking balance:", error);
    throw error;
  }
}

export async function checkIfOwnsSpecificToken(
  userAddress: string,
  tokenAddress: string,
  tokenId: number
) {
  const contract = new Contract(["ERC721_ABI"], tokenAddress, provider);
  try {
    const owner = await contract.ownerOf(tokenId);
    return owner.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking specific token ownership:", error);
    throw error;
  }
}
