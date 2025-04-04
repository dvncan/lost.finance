import type { NextApiRequest, NextApiResponse } from "next";
import { isAddress } from "@/utils/ethereum";
import { createPublicClient, http, type PublicClient } from "viem";
import { sepolia, mainnet } from "viem/chains";
import BlacklistABI from "@/abi/Blacklist.json";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ALCHEMY_API_KEY || !process.env.NETWORK) {
  throw new Error(
    "Missing required environment variables: ALCHEMY_API_KEY and NETWORK"
  );
}

const CONTRACT_ADDRESS = "0xEE5085D66FE9D6dD3A52C9197EbC526B730CaBb0" as const;

// Network configuration
const NETWORK_CONFIG = {
  sepolia: {
    chain: sepolia,
    url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    chainId: 11155111,
  },
  mainnet: {
    chain: mainnet,
    url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    chainId: 1,
  },
} as const;

type Network = keyof typeof NETWORK_CONFIG;

type ScammerReport = {
  stage: bigint;
  to: string;
  txIn: string;
  timestamp: bigint;
};

type ResponseData = {
  status: "malicious" | "safe" | "error";
  details?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { address } = req.query;

    // Validate address
    if (!address || typeof address !== "string" || !isAddress(address)) {
      return res.status(400).json({
        status: "error",
        details: "Invalid Ethereum address",
      });
    }

    // Validate network configuration
    const network = process.env.NETWORK as Network;
    if (!NETWORK_CONFIG[network]) {
      return res.status(500).json({
        status: "error",
        details: "Invalid network configuration",
      });
    }

    // Initialize public client
    const publicClient = createPublicClient({
      chain: NETWORK_CONFIG[network].chain,
      transport: http(NETWORK_CONFIG[network].url),
    });

    // Check if address is reported
    const isReported = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: BlacklistABI,
      functionName: 'isAddressReported',
      args: [address],
    });

    if (isReported) {
      const reports = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: BlacklistABI,
        functionName: 'getAllAddressReports',
        args: [address],
      }) as ScammerReport[];

      const formattedReports = reports.map((report: ScammerReport) => ({
        stage: Number(report.stage),
        to: report.to,
        txIn: report.txIn,
        timestamp: Number(report.timestamp),
      }));

      return res.status(200).json({
        status: "malicious",
        details: {
          reportCount: reports.length,
          reports: formattedReports,
          network,
          chainId: NETWORK_CONFIG[network].chainId,
        },
      });
    }

    return res.status(200).json({
      status: "safe",
      details: {
        network,
        chainId: NETWORK_CONFIG[network].chainId,
      },
    });
  } catch (error: any) {
    console.error("Error checking address:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      data: error.data,
    });

    // Don't expose sensitive error details in production
    const errorResponse =
      process.env.NODE_ENV === "production"
        ? { message: "An error occurred while checking the address" }
        : { message: error.message, code: error.code };

    return res.status(500).json({
      status: "error",
      details: errorResponse,
    });
  }
}
