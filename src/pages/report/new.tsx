import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { isAddress, isTransactionHash } from "@/utils/ethereum";
import { useAccount, useWriteContract, useWatchContractEvent } from "wagmi";
import BlacklistABI from "@/abi/Blacklist.json";
import { sepolia } from "@wagmi/chains";
import { config } from "@/config/wagmi";

const CONTRACT_ADDRESS =
  "0xEE5085D66FE9D6dD3A52C9197EbC526B730CaBb0" as `0x${string}`;

type TransactionEntry = {
  id: string;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
};

type FormData = {
  reporterAddress: string;
  transactions: TransactionEntry[];
};

export default function NewReport() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, chain, isConnected } = useAccount();

  const { writeContract, isError, isPending } = useWriteContract({
    config,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      reporterAddress: address || "",
      transactions: [
        { id: uuidv4(), fromAddress: "", toAddress: "", transactionHash: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactions",
  });

  // Watch for the ScamReported event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: BlacklistABI,
    eventName: "ScamReported",
    onLogs(logs) {
      setIsSubmitting(false);
      router.push("/report/success");
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (chain?.id !== sepolia.id) {
      alert("Please switch to the Sepolia test network");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for contract
      const scammers = data.transactions.map((t) => t.toAddress);
      const transactions = data.transactions.map((t) => t.transactionHash);

      // Submit to contract
      await writeContract(
        {
          abi: BlacklistABI,
          address: CONTRACT_ADDRESS,
          functionName: "reportAddress",
          args: [
            {
              scammers,
              transactions,
            },
          ],
        },
        {
          onSuccess(data) {
            console.log("Transaction hash:", data);
          },
          onError(error) {
            console.error("Error submitting report:", error);
            setIsSubmitting(false);
            alert("Failed to submit report. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      setIsSubmitting(false);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>
          Report Crypto Scam | Document Ethereum Fraud | Cryptocurrency Theft
          Reporting
        </title>
        <meta
          name="description"
          content="Report cryptocurrency scams and Ethereum fraud. Document blockchain scams, phishing attempts, and malicious actors to protect the crypto community from theft."
        />
        <meta
          name="keywords"
          content="report crypto scam, ethereum fraud report, cryptocurrency theft, report blockchain scam, crypto fraud reporting, document crypto scam, ethereum scam alert, crypto phishing report"
        />

        {/* Open Graph / Social Media Meta Tags */}
        <meta
          property="og:title"
          content="Report Crypto Scam | Document Ethereum Fraud"
        />
        <meta
          property="og:description"
          content="Report cryptocurrency scams and Ethereum fraud. Document blockchain scams, phishing attempts, and malicious actors to protect the crypto community from theft."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ethfraudreport.com/report/new"
        />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 text-white glow-text">
          Report Cryptocurrency Fraud
        </h1>

        <div className="card hover:glow transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="reporterAddress" className="label">
                Your Ethereum Address
              </label>
              <input
                id="reporterAddress"
                type="text"
                className="input"
                placeholder="0x..."
                disabled
                value={address || ""}
                {...register("reporterAddress")}
              />
              {!address && (
                <p className="mt-1 text-sm text-danger-400">
                  Please connect your wallet first
                </p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Crypto Scam Transaction Trail
              </h2>
              <p className="text-gray-300 mb-4">
                Add the sequence of transactions that led to the fraud. This
                helps establish the path from your address to the final
                malicious address and document the cryptocurrency theft.
              </p>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-dark-600 rounded-lg bg-dark-900"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-white">
                        Transaction {index + 1}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-danger-400 hover:text-danger-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label">From Address</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="0x..."
                          {...register(`transactions.${index}.fromAddress`, {
                            required: "From address is required",
                            validate: (value) =>
                              isAddress(value) || "Invalid Ethereum address",
                          })}
                        />
                        {errors.transactions?.[index]?.fromAddress && (
                          <p className="mt-1 text-sm text-danger-400">
                            {errors.transactions[index]?.fromAddress?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="label">To Address (Scammer)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="0x..."
                          {...register(`transactions.${index}.toAddress`, {
                            required: "To address is required",
                            validate: (value) =>
                              isAddress(value) || "Invalid Ethereum address",
                          })}
                        />
                        {errors.transactions?.[index]?.toAddress && (
                          <p className="mt-1 text-sm text-danger-400">
                            {errors.transactions[index]?.toAddress?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        Transaction Hash (Evidence)
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="0x..."
                        {...register(`transactions.${index}.transactionHash`, {
                          required: "Transaction hash is required",
                          validate: (value) =>
                            isTransactionHash(value) ||
                            "Invalid transaction hash",
                        })}
                      />
                      {errors.transactions?.[index]?.transactionHash && (
                        <p className="mt-1 text-sm text-danger-400">
                          {errors.transactions[index]?.transactionHash?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  append({
                    id: uuidv4(),
                    fromAddress: "",
                    toAddress: "",
                    transactionHash: "",
                  })
                }
                className="btn btn-secondary mt-4"
              >
                Add Another Transaction
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isPending || !address}
              >
                {isSubmitting || isPending
                  ? "Submitting to Blockchain..."
                  : "Submit Report"}
              </button>
            </div>

            {isError && (
              <div className="mt-4 text-danger-400">
                Transaction failed. Please try again.
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Why Report Cryptocurrency Scams?
          </h2>
          <p className="text-gray-300 mb-4">
            By reporting crypto fraud and scams, you help protect others in the
            blockchain community from falling victim to the same schemes. Your
            reports contribute to a safer cryptocurrency ecosystem.
          </p>
          <p className="text-gray-300">
            Each documented case helps improve fraud detection systems and
            raises awareness about common scam techniques on the Ethereum
            network.
          </p>
          <p className="text-gray-300">
            If you don't have any ETH on the Sepolia testnet, you can use a faucet like <a href="https://faucet.sepolia.org/">https://faucet.sepolia.org/</a> to request some. This will allow you to submit your report on the testnet without incurring any costs.
        </div>
      </div>
    </>
  );
}
