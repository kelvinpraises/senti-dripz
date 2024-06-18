import { createConfig, http } from "wagmi";
import { mainnet, moonbaseAlpha, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, moonbaseAlpha],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [moonbaseAlpha.id]: http(),
  },
});
