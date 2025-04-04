import { createConfig, http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import dotenv from "dotenv";

dotenv.config();

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: "13137a5ecd64f636bd444610d94a661b",
    }),
  ],
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  },
});
