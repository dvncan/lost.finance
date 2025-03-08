import { useAccount, useConnect } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  if (isConnected) {
    console.log("Connected to", address);
    return (
      <div className="text-white">
        Connected to {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => connect({ connector: injected() })}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Connect with MetaMask
      </button>
      <button
        onClick={() =>
          connect({
            connector: walletConnect({
              projectId: "13137a5ecd64f636bd444610d94a661b", // Get this from https://cloud.walletconnect.org/
            }),
          })
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Connect with WalletConnect
      </button>
    </div>
  );
}
