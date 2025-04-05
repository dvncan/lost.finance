import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { createStorage } from "@wagmi/core";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useState } from "react";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only render client-side
  if (!mounted) {
    setMounted(true);
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Lost Finance - Blockchain Security Verification</title>
          <meta
            name="description"
            content="Verify and report blockchain addresses for enhanced network security"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="keywords"
            content="blockchain security, smart contract verification, address verification, transaction verification, blockchain analytics, web3 security, digital asset protection, blockchain monitoring, secure transactions, blockchain compliance, wallet security, blockchain risk assessment, defi security, blockchain transparency, secure web3, scam reporting, web3 fraud protection, address verification api, address verification sdk, address verification interface, address verification tool, address verification service, scam reporting service, scam reporting tool, web3 scam reporting, web3 scam protection, web3 scam detection, web3 scam prevention, web3 security tool, web3 security platform, web3 security service, web3 security monitoring, web3 security analytics, web3 security verification, web3 security verification platform, web3 security verification service"
          />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="Lost Finance - Blockchain Security Verification"
          />
          <meta
            property="og:description"
            content="Professional blockchain address verification and security monitoring platform"
          />
          <meta property="og:type" content="website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
