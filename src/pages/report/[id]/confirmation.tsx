import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ReportConfirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-300">Loading confirmation...</p>
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
        <title>Crypto Scam Report Submitted | Powered by lost.finance</title>
        <meta
          name="description"
          content="Thank you for reporting a cryptocurrency scam. Your contribution helps protect the blockchain community from fraud and improves crypto security."
        />
        <meta
          name="keywords"
          content="crypto scam report submitted, ethereum fraud registry, cryptocurrency scam alert, blockchain security contribution, crypto fraud prevention, report crypto theft, ethereum scam database"
        />

        {/* Open Graph / Social Media Meta Tags */}
        <meta
          property="og:title"
          content="Crypto Scam Report Submitted | Ethereum Fraud Registry"
        />
        <meta
          property="og:description"
          content="Thank you for reporting a cryptocurrency scam. Your contribution helps protect the blockchain community from fraud and improves crypto security."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://ethfraudreport.com/report/${id}/confirmation`}
        />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="card text-center hover:glow transition-all duration-300">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-white">
            Crypto Scam Report Submitted Successfully
          </h1>

          <p className="text-gray-300 mb-8">
            Thank you for helping to make the cryptocurrency ecosystem safer.
            Your report has been recorded and will help others avoid similar
            blockchain scams.
          </p>

          <div className="bg-dark-900 p-4 rounded-lg mb-8 text-left border border-dark-700">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Crypto Fraud Report Summary
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-400">Report ID:</p>
              <p className="font-mono text-sm text-gray-300">{report.id}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400">Submitted by:</p>
              <p className="font-mono text-sm text-gray-300">
                {report.reporterAddress}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400">
                Reported Malicious Addresses:
              </p>
              <ul className="list-disc list-inside">
                {report.transactions.map((tx: any) => (
                  <li key={tx.id} className="font-mono text-sm text-gray-300">
                    {tx.toAddress}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-400">Submitted on:</p>
              <p className="text-sm text-gray-300">
                {new Date(
                  report.updatedAt || report.createdAt
                ).toLocaleString()}
              </p>
            </div>

            {report.optionalNote && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  Your Personal Note (Not stored on-chain):
                </p>
                <p className="text-sm text-gray-300 bg-dark-800 p-2 rounded-md border border-dark-600 mt-1">
                  {report.optionalNote}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link href="/check" className="btn btn-secondary">
              Check Another Address
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Strengthening Blockchain Security Together
          </h2>
          <p className="text-gray-300 mb-4">
            Your contribution to our cryptocurrency fraud database helps create
            a safer blockchain ecosystem for everyone. Each report improves our
            ability to detect and prevent crypto scams.
          </p>
          <p className="text-gray-300">
            Share this platform with others who may have experienced crypto
            theft to help build a comprehensive registry of Ethereum scams and
            protect the community.
          </p>
        </div>
      </div>
    </>
  );
}
