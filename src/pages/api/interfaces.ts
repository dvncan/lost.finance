type UserReport = {
  chainId: number;
  scammers: string[]; // msg.sender -> 1 -> 2 -> 3 -> 4
  transactions: string[]; // 1 -> 2 -> 3
};

/// @notice TransactionDetails is a struct that contains the transaction hash and chain id of a transaction.
/// @dev transactionHash is the hash of the transaction.
/// @dev chainId is the chain id of the transaction.
type TransactionDetails = {
  transactionHash: string;
  chainId: number;
};

/// @notice ScammerReported is a struct that contains the reported status, scammer address, and transaction details of a scammer.
/// @dev reported is the reported status of the scammer.
/// @dev scammerAddress is the address of the scammer.
/// @dev transaction is the list of transaction details of the scammer.
type ScammerReported = {
  reported: boolean;
  scammerAddress: string;
  transaction: TransactionDetails[];
};

/// @notice ScammerAddressRecord is a struct that contains the stage, address, transaction hash, and timestamp of a scammer.
/// @dev stage is the stage of the scammer.
/// @dev to is the address of the scammer.
/// @dev txIn is the transaction hash of the scammer.
/// @dev timestamp is the timestamp of the transaction.
type ScammerAddressRecord = {
  stage: number;
  to: string;
  txIn: string;
  timestamp: number;
};

/// @notice Set is a struct that contains the index and address of a scammer.
/// @dev index is the index of the scammer.
/// @dev addr is the address of the scammer.
type Tuple = {
  index: number;
  addr: string;
};

export interface IESR {
  reportAddress(report: UserReport): Promise<void>;
  isAddressReported(addr: string): Promise<boolean>;
  getAllAddressReports(addr: string): Promise<ScammerAddressRecord[]>;
  getAllAddressTransactions(addr: string): Promise<TransactionDetails[]>;
}
