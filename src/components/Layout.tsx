import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
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

      <header className="bg-dark-800 border-b border-dark-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  className="text-xl font-bold text-primary-500 glow-text"
                >
                  Lost Finance
                </Link>
              </div>

              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/report/new"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/report/new")
                      ? "border-primary-500 text-white"
                      : "border-transparent text-gray-400 hover:border-dark-500 hover:text-gray-300"
                  }`}
                >
                  Report Address
                </Link>
                <Link
                  href="/check"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/check")
                      ? "border-primary-500 text-white"
                      : "border-transparent text-gray-400 hover:border-dark-500 hover:text-gray-300"
                  }`}
                >
                  Verify Address
                </Link>
                <Link
                  href="/reports"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/reports")
                      ? "border-primary-500 text-white"
                      : "border-transparent text-gray-400 hover:border-dark-500 hover:text-gray-300"
                  }`}
                >
                  Toxic List
                </Link>
              </nav>
            </div>

            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button type="button" className="btn btn-primary glow">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-dark-800 border-b border-dark-700">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/")
                    ? "bg-dark-700 border-primary-500 text-primary-400"
                    : "border-transparent text-gray-400 hover:bg-dark-700 hover:border-dark-500 hover:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lost Finance
              </Link>
              <Link
                href="/report/new"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/report/new")
                    ? "bg-dark-700 border-primary-500 text-primary-400"
                    : "border-transparent text-gray-400 hover:bg-dark-700 hover:border-dark-500 hover:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Report Address
              </Link>
              <Link
                href="/check"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/check")
                    ? "bg-dark-700 border-primary-500 text-primary-400"
                    : "border-transparent text-gray-400 hover:bg-dark-700 hover:border-dark-500 hover:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Verify Address
              </Link>
              <Link
                href="/reports"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/reports")
                    ? "bg-dark-700 border-primary-500 text-primary-400"
                    : "border-transparent text-gray-400 hover:bg-dark-700 hover:border-dark-500 hover:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Toxic List
              </Link>
              <div className="mt-4 pl-3 pr-4">
                <button type="button" className="btn btn-primary w-full">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

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
