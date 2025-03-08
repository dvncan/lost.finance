import type { NextApiRequest, NextApiResponse } from "next";
import { isAddress } from "@/utils/ethereum";
import { ethers } from "ethers";
import BlacklistABI from "@/abi/Blacklist.json";
import dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = "0xEE5085D66FE9D6dD3A52C9197EbC526B730CaBb0";

type ScammerReport = {
  stage: ethers.BigNumberish;
  to: string;
  txIn: string;
  timestamp: ethers.BigNumberish;
};

// Initialize provider and contract
const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY
);
const contract = new ethers.Contract(CONTRACT_ADDRESS, BlacklistABI, provider);

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

    console.log("Checking address:", address);

    // Validate address
    if (!address || typeof address !== "string" || !isAddress(address)) {
      return res.status(400).json({
        status: "error",
        details: "Invalid Ethereum address",
      });
    }

    console.log("Calling isAddressReported for:", address);
    const isReported = await contract.isAddressReported(address);
    console.log("isReported result:", isReported);

    if (isReported) {
      console.log("Getting reports for address:", address);
      const reports = await contract.getAllAddressReports(address);
      console.log("Reports received:", reports);

      const formattedReports = reports.map((report: ScammerReport) => ({
        stage: Number(report.stage),
        to: report.to,
        txIn: ethers.hexlify(report.txIn),
        timestamp: Number(report.timestamp),
      }));

      return res.status(200).json({
        status: "malicious",
        details: {
          reportCount: reports.length,
          reports: formattedReports,
        },
      });
    }

    return res.status(200).json({
      status: "safe",
    });
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      data: error.data,
    });

    return res.status(500).json({
      status: "error",
      details: {
        message: error.message,
        code: error.code,
      },
    });
  }
}
