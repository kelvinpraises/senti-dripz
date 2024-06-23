import { Contract, RpcProvider, uint256 } from "starknet";

const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });

interface GatingCriteria {
  gated_account: string;
  in_collection: string | null;
  min_balance: [string, string] | null;
  token_id: [string, string] | null;
}

interface Instance {
  id: string;
  initiator: string;
  initiator_erc20: string;
  initiator_amount: string;
  counter_party_erc20: string;
  counter_party_amount: string;
  state: number;
  gating: GatingCriteria;
}

export async function getInstanceDetails(
  contractAddress: string,
  id: number
): Promise<Instance> {
  const abi = [
    {
      name: "find_instance",
      type: "function",
      inputs: [{ name: "id", type: "felt" }],
      outputs: [
        {
          name: "instance",
          type: "Instance",
        },
      ],
    },
  ];

  const contract = new Contract(abi, contractAddress, provider);
  const instance = await contract.find_instance(id);
  return instance;
}

export async function getERC20Details(tokenAddress: string) {
  const erc20Abi = [
    {
      name: "name",
      type: "function",
      inputs: [],
      outputs: [{ name: "name", type: "felt" }],
    },
    {
      name: "symbol",
      type: "function",
      inputs: [],
      outputs: [{ name: "symbol", type: "felt" }],
    },
  ];

  const contract = new Contract(erc20Abi, tokenAddress, provider);
  const [name, symbol] = await Promise.all([
    contract.name(),
    contract.symbol(),
  ]);

  return { name, symbol };
}
