import { useState } from "react";
import { useAccount } from "wagmi";
import { switchNetwork } from "@wagmi/core";
import { sepolia } from "@wagmi/chains";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { config } from "@/config/wagmi";

interface NetworkSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NetworkSwitchModal({
  isOpen,
  onClose,
}: NetworkSwitchModalProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const { address, chain } = useAccount();

  const isOnSepolia = chain?.id === sepolia.id;

  const handleSwitchNetwork = async () => {
    try {
      setIsSwitching(true);
      await switchNetwork(config, { chainId: isOnSepolia ? 1 : sepolia.id });
      onClose();
    } catch (error) {
      console.error("Error switching network:", error);
      alert("Failed to switch network. Please try again.");
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Network Switch</h2>
          <Button
            onClick={onClose}
            variant="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            You are currently on the {isOnSepolia ? "Sepolia" : "Mainnet"}{" "}
            network.
          </p>
        </div>

        <Button
          onClick={handleSwitchNetwork}
          disabled={isSwitching}
          variant="default"
          className="w-full"
        >
          {isSwitching
            ? "Switching network..."
            : `Switch to ${isOnSepolia ? "Mainnet" : "Sepolia"}`}
        </Button>
      </div>
    </div>
  );
}
