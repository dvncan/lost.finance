import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isAddress } from "@/utils/ethereum";
import { useReadContract } from "wagmi";
import BlacklistABI from "@/abi/Blacklist.json";
import { useClient } from "../hooks/useClient";
import NetworkSwitchModal from "@/components/NetworkSwitchModal";
import { sepolia } from "@wagmi/chains";
import { useAccount } from "wagmi";
import { useConfig } from "wagmi";

const CONTRACT_ADDRESS = "0xEE5085D66FE9D6dD3A52C9197EbC526B730CaBb0";

type FormData = {
  address: string;
};

type ScammerReport = {
  stage: bigint;
  to: string;
  txIn: string;
  timestamp: bigint;
};

export default function CheckAddress() {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [result, setResult] = useState<{
    status: string;
    details?: any;
  } | null>(null);
  const isClient = useClient();
  const addressToCheck = watch("address");
  const { chain } = useAccount();
  const { isConnected } = useAccount();
  const [showNetworkModal, setShowNetworkModal] = useState(
    chain?.id !== sepolia.id
  );

  // Show network modal when user connects
  useEffect(() => {
    if (isClient && isConnected && chain?.id !== sepolia.id) {
      setShowNetworkModal(true);
    }
  }, [isClient, isConnected, chain]);

  const { data: isReported, isLoading: isCheckingReported } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BlacklistABI,
    functionName: "isAddressReported",
    args: isAddress(addressToCheck || "") ? [addressToCheck] : undefined,
  });

  const { data: reports, isLoading: isLoadingReports } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BlacklistABI,
    functionName: "getAllAddressReports",
    args:
      isAddress(addressToCheck || "") && isReported
        ? [addressToCheck]
        : undefined,
  });

  const isLoading = isCheckingReported || isLoadingReports;

  const onSubmit = async (data: FormData) => {
    if (!isAddress(data.address)) {
      setResult({
        status: "error",
        details: "Invalid Ethereum address",
      });
      return;
    }

    try {
      if (isReported) {
        const formattedReports = (reports as ScammerReport[])?.map(
          (report) => ({
            stage: Number(report.stage),
            to: report.to,
            txIn: report.txIn,
            timestamp: Number(report.timestamp),
          })
        );

        setResult({
          status: "malicious",
          details: {
            reportCount: formattedReports?.length || 0,
            reports: formattedReports,
          },
        });
      } else {
        setResult({ status: "safe" });
      }
    } catch (error) {
      console.error("Error checking address:", error);
      setResult({
        status: "error",
        details: "Failed to check address",
      });
    }
  };

  // Prevent rendering wagmi hooks on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Head>
          <div>
            <title>
              Verify Ethereum Address | Check for Crypto Scams | Blockchain
              Security Tool
            </title>
            <meta
              name="description"
              content="Verify Ethereum addresses before sending funds. Our crypto fraud detection tool checks if an address has been reported for scams, helping you avoid cryptocurrency theft."
            />
            <meta
              name="keywords"
              content="verify ethereum address, check crypto scam, crypto fraud detection, blockchain security check, ethereum address verification, crypto scam checker, cryptocurrency security, crypto fraud prevention"
            />
          </div>
        </Head>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Checking Address...
          </h1>
          <p className="text-gray-300">
            Please wait while we verify the address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Head>
        <title>
          Verify Ethereum Address | Check for Crypto Scams | Blockchain Security
          Tool
        </title>
        <meta
          name="description"
          content="Verify Ethereum addresses before sending funds. Our crypto fraud detection tool checks if an address has been reported for scams, helping you avoid cryptocurrency theft."
        />
        <meta
          name="keywords"
          content="verify ethereum address, check crypto scam, crypto fraud detection, blockchain security check, ethereum address verification, crypto scam checker, cryptocurrency security, crypto fraud prevention"
        />
      </Head>
      <div>
        {/* Network Switch Modal */}
        <NetworkSwitchModal
          isOpen={showNetworkModal}
          onClose={() => setShowNetworkModal(false)}
        />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          Verify Ethereum Address
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="address" className="block text-white mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full px-4 py-2 border rounded-lg bg-dark-800 border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="Enter Ethereum address to check"
            />
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-lg bg-dark-800 border">
              {result.status === "malicious" ? (
                <div className="text-red-400">
                  <h2 className="font-semibold mb-2">
                    Warning: Malicious Address
                  </h2>
                  <p>This address has been reported for fraudulent activity.</p>
                  {result.details && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">
                        Reports ({result.details.reportCount})
                      </h3>
                      <ul className="space-y-2">
                        {result.details.reports.map(
                          (report: any, index: number) => (
                            <li key={index} className="text-gray-300">
                              <p>
                                Reported at:{" "}
                                {new Date(
                                  report.timestamp * 1000
                                ).toLocaleString()}
                              </p>
                              <p>Transaction: {report.txIn.slice(0, 10)}...</p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : result.status === "safe" ? (
                <div className="text-green-400">
                  <h2 className="font-semibold mb-2">Safe Address</h2>
                  <p>
                    This address has not been reported for fraudulent activity.
                  </p>
                </div>
              ) : (
                <div className="text-red-400">
                  <h2 className="font-semibold mb-2">Error</h2>
                  <p>{result.details}</p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
          >
            {isLoading ? "Checking..." : "Check Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
