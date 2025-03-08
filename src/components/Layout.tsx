import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import dynamic from "next/dynamic";

// Create a client-only wallet button component
const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      await connect({ connector: injected() });
    } catch (err: any) {
      setError(err?.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return isConnected ? (
    <div className="flex items-center gap-4">
      <span className="text-gray-300 font-mono">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <button onClick={() => disconnect()} className="btn btn-secondary btn-sm">
        Disconnect
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-end">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn btn-primary btn-sm"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

// Dynamically import the wallet button with no SSR
const DynamicWalletButton = dynamic(
  () => import("./WalletButton").then((mod) => mod.WalletButton),
  { ssr: false }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      await connect({ connector: injected() });
    } catch (err: any) {
      setError(err?.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const showBackButton = router.pathname !== "/";

  return (
    <div className="min-h-screen bg-dark-950">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Report cryptocurrency scams, verify Ethereum addresses, and protect yourself from crypto fraud. Our blockchain security tool helps identify malicious actors and prevent crypto theft."
        />
        <meta
          name="keywords"
          content="crypto scam, ethereum fraud, report crypto scam, cryptocurrency fraud, blockchain security, crypto theft, ethereum scam, crypto fraud detection, crypto scam alert, crypto fraud prevention"
        />
      </Head>

      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-full hover:bg-dark-800 transition-colors duration-200"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
                </button>
              )}
              <Link href="/" className="text-xl font-bold text-white">
                lost.finance
              </Link>
            </div>
            <div className="flex items-center">
              <DynamicWalletButton />
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-dark-800 border-t border-dark-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Lost Finance. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Keywords: crypto scam, ethereum fraud, report crypto scam,
              cryptocurrency fraud, blockchain security, crypto theft, ethereum
              scam, crypto fraud detection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
