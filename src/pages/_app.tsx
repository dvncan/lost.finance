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
import dotenv from "dotenv";
dotenv.config();

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/process.env.ALCHEMY_API_KEY"
    ),
  },
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  multiInjectedProviderDiscovery: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://ethfraudreport.com" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiProvider>
      </QueryClientProvider>
    </>
  );
}
