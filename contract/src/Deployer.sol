// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

contract DeployBytecode {
    event DeployedBytecodeResult(address deployed);

    function deployFromBytecode(bytes memory bytecode) public returns (address deployed) {
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(deployed != address(0), "Deployment failed");

        emit DeployedBytecodeResult(deployed);
        return deployed;
    }
}
