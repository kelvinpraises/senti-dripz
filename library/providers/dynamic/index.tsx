import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { EthereumIcon, StarknetIcon } from "@dynamic-labs/iconic";
import { WalletConnectorsMethod } from "@dynamic-labs/wallet-connector-core";

import {
  FilterChain,
  DynamicContextProvider as _DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";

const EthWallets = {
  label: { icon: <EthereumIcon /> },
  walletsFilter: FilterChain("EVM"),
  recommendedWallets: [
    {
      walletKey: "metamask",
    },
  ],
};

const StarkWallets = {
  label: { icon: <StarknetIcon /> },
  walletsFilter: FilterChain("STARK"),
  recommendedWallets: [
    {
      walletKey: "braavos",
    },
  ],
};

const views = [
  {
    type: "wallet-list" as const,
    tabs: {
      items: [EthWallets, StarkWallets],
    },
  },
];

export const DynamicContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <_DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_PUBLISHABLE_KEY || "",
        walletConnectors: [
          EthereumWalletConnectors,
          StarknetWalletConnectors as WalletConnectorsMethod,
        ],
        overrides: {
          views: views,
        },
      }}
    >
      {children}
    </_DynamicContextProvider>
  );
};

export { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
