import { ethers } from "ethers";

/**
 * Validates if a string is a valid Ethereum address
 */
export function isAddress(value: string): boolean {
  try {
    return ethers.isAddress(value);
  } catch (error) {
    return false;
  }
}

/**
 * Validates if a string is a valid Ethereum transaction hash
 */
export function isTransactionHash(value: string): boolean {
  try {
    // Transaction hashes are 66 characters long (including 0x prefix)
    // and contain only hexadecimal characters
    return /^0x([A-Fa-f0-9]{64})$/.test(value);
  } catch (error) {
    return false;
  }
}

/**
 * Shortens an Ethereum address for display
 */
export function shortenAddress(address: string): string {
  if (!isAddress(address)) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

/**
 * Shortens a transaction hash for display
 */
export function shortenTxHash(hash: string): string {
  if (!isTransactionHash(hash)) return "";
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

export function getEtherscanLink(
  address: string,
  type: "address" | "tx" | "token",
  network: "mainnet" | "testnet"
): string {
  const baseUrl = "https://etherscan.io";

  switch (type) {
    case "address":
      return `${baseUrl}/address/${address}`;
    case "tx":
      return `${baseUrl}/tx/${address}`;
    case "token":
      return `${baseUrl}/token/${address}`;
    default:
      return "";
  }
}
