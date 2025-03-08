import { useState, useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    if (isConnecting) return; // Prevent multiple connection attempts

    try {
      setError(null);
      setIsConnecting(true);

      // Add timeout to the connection attempt
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timeout")), 30000);
      });

      await Promise.race([connect({ connector: injected() }), timeoutPromise]);
    } catch (err: any) {
      const errorMessage = err.message?.includes("timeout")
        ? "Connection timed out. Please try again."
        : err.message === "Connector not found"
        ? "Please install MetaMask"
        : "Failed to connect wallet. Please try again.";

      setError(errorMessage);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [connect, isConnecting]);

  // Clear error when connection status changes
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

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
}
