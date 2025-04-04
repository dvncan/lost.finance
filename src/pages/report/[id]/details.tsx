import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type FormData = {
  description: string;
  scamType: string;
  additionalInfo: string;
  optionalNote: string;
};

export default function ReportDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      scamType: "",
      additionalInfo: "",
      optionalNote: "",
    },
  });

  // change from local storage to api call or contract call
  useEffect(() => {
    if (id) {
      // In a real app, this would fetch from your API
      const reports = JSON.parse(localStorage.getItem("fraudReports") || "[]");
      const foundReport = reports.find((r: any) => r.id === id);

      if (foundReport) {
        setReport(foundReport);
      } else {
        router.push("/report/new");
      }

      setIsLoading(false);
    }
  }, [id, router]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would update via your API
      const reports = JSON.parse(localStorage.getItem("fraudReports") || "[]");
      const updatedReports = reports.map((r: any) => {
        if (r.id === id) {
          return {
            ...r,
            ...data,
            status: "complete",
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });

      localStorage.setItem("fraudReports", JSON.stringify(updatedReports));
      router.push(`/report/${id}/confirmation`);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-300">Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-300">Report not found. Redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Document Crypto Scam Details | Ethereum Fraud Report | Cryptocurrency
          Theft
        </title>
        <meta
          name="description"
          content="Document details of cryptocurrency scams and Ethereum fraud. Help others avoid similar crypto theft by providing comprehensive information about blockchain scams."
        />
        <meta
          name="keywords"
          content="document crypto scam, ethereum fraud details, cryptocurrency theft report, blockchain scam documentation, crypto fraud evidence, crypto scam techniques, ethereum scam types"
        />

        {/* Open Graph / Social Media Meta Tags */}
        <meta
          property="og:title"
          content="Document Crypto Scam Details | Ethereum Fraud Report"
        />
        <meta
          property="og:description"
          content="Document details of cryptocurrency scams and Ethereum fraud. Help others avoid similar crypto theft by providing comprehensive information about blockchain scams."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://ethfraudreport.com/report/${id}/details`}
        />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 text-white glow-text">
          Document Crypto Scam Details
        </h1>

        <div className="card mb-8 hover:glow transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Cryptocurrency Fraud Transaction Summary
          </h2>
          <div className="bg-dark-900 p-4 rounded-lg mb-4 border border-dark-700">
            <p className="text-sm text-gray-400 mb-2">Reporter Address:</p>
            <p className="font-mono text-sm mb-4 text-gray-300">
              {report.reporterAddress}
            </p>

            <p className="text-sm text-gray-400 mb-2">Transaction Path:</p>
            <div className="space-y-2">
              {report.transactions.map((tx: any, index: number) => (
                <div key={tx.id} className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-mono text-sm truncate text-gray-300">
                      {tx.fromAddress}
                    </span>
                    <span className="mx-2 text-primary-500">→</span>
                    <span className="font-mono text-sm truncate text-gray-300">
                      {tx.toAddress}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tx: {tx.transactionHash.substring(0, 10)}...
                    {tx.transactionHash.substring(
                      tx.transactionHash.length - 8
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card hover:glow transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="description" className="label">
                Describe the Crypto Scam in Detail
              </label>
              <textarea
                id="description"
                rows={5}
                className="input"
                placeholder="Explain how you were scammed, what techniques were used, and what happened to your cryptocurrency..."
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 50,
                    message: "Please provide at least 50 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-danger-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="scamType" className="label">
                Type of Cryptocurrency Scam
              </label>
              <select
                id="scamType"
                className="input"
                {...register("scamType", {
                  required: "Please select a scam type",
                })}
              >
                <option value="">Select a type...</option>
                <option value="phishing">Phishing Attack</option>
                <option value="fake_token">Fake Token/Coin</option>
                <option value="ponzi">Ponzi/Pyramid Scheme</option>
                <option value="fake_exchange">Fake Exchange</option>
                <option value="fake_giveaway">Fake Giveaway/Airdrop</option>
                <option value="malicious_contract">
                  Malicious Smart Contract
                </option>
                <option value="wallet_hack">Wallet Compromise</option>
                <option value="impersonation">
                  Team/Celebrity Impersonation
                </option>
                <option value="rug_pull">Rug Pull</option>
                <option value="other">Other</option>
              </select>
              {errors.scamType && (
                <p className="mt-1 text-sm text-danger-400">
                  {errors.scamType.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="additionalInfo" className="label">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                className="input"
                placeholder="Any other details that might help others avoid this crypto scam, such as warning signs, red flags, or specific techniques used by the scammer..."
                {...register("additionalInfo")}
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="optionalNote" className="label">
                Personal Note (Optional, not stored on-chain)
              </label>
              <textarea
                id="optionalNote"
                rows={3}
                className="input"
                placeholder="Add any personal context or notes about this situation. This information will not be stored on-chain and is for your reference only..."
                {...register("optionalNote")}
              ></textarea>
              <p className="mt-1 text-xs text-gray-400">
                This note is for your personal reference and will not be stored
                on-chain.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Complete Fraud Report"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Why Detailed Documentation Matters
          </h2>
          <p className="text-gray-300 mb-4">
            Comprehensive details about cryptocurrency scams help others
            identify and avoid similar fraud attempts. Your thorough
            documentation contributes to blockchain security and crypto fraud
            prevention.
          </p>
          <p className="text-gray-300">
            The more specific information you can provide about the scam
            techniques used, the better equipped the community will be to
            recognize and avoid these threats.
          </p>
        </div>
      </div>
    </>
  );
}
