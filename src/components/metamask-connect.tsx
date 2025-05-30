"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Wallet, ExternalLink } from "lucide-react";
import { createClient } from "../../supabase/client";

interface MetaMaskConnectProps {
  onConnected?: () => void;
}

export default function MetaMaskConnect({ onConnected }: MetaMaskConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true);

      // Check if already connected
      checkConnection();

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectMetaMask = async () => {
    if (!isMetaMaskInstalled) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);

        // Get network info
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const networkName = getNetworkName(chainId);

        // Simulate adding positions to database
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Add sample cross-chain positions
          const samplePositions = [
            {
              user_id: user.id,
              blockchain: "ethereum",
              asset_address: "0xA0b86a33E6B5e8C5FaE44e1A9B7c7C9F8A1e4B5B",
              asset_symbol: "USDC",
              balance: 15000.0,
              usd_value: 15000.0,
              position_type: "stablecoin",
            },
            {
              user_id: user.id,
              blockchain: "ethereum",
              asset_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              asset_symbol: "WETH",
              balance: 5.2,
              usd_value: 11628.0,
              position_type: "asset",
            },
            {
              user_id: user.id,
              blockchain: "polygon",
              asset_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              asset_symbol: "USDC",
              balance: 8500.0,
              usd_value: 8500.0,
              position_type: "stablecoin",
            },
          ];

          for (const position of samplePositions) {
            await supabase.from("cross_chain_positions").upsert(position);
          }
        }

        // Call onConnected callback
        if (onConnected) {
          onConnected();
        }

        // Redirect to cross-chain page with success message
        window.location.href = "/dashboard/cross-chain?connected=true";
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);
      if (error.code === 4001) {
        setError(
          "Connection rejected. Please approve the connection in MetaMask."
        );
      } else {
        setError("Failed to connect to MetaMask. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      "0x1": "Ethereum",
      "0x89": "Polygon",
      "0xa4b1": "Arbitrum",
      "0xa": "Optimism",
      "0x38": "BNB Smart Chain",
    };
    return networks[chainId] || "Unknown Network";
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="border border-yellow-200 shadow-lg bg-gradient-to-br from-yellow-50/50 to-orange-50/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">MetaMask Required</h3>
          </div>
          <p className="text-yellow-700 mb-6">
            MetaMask is required to connect your wallet. Please install MetaMask
            to continue.
          </p>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
          >
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Install MetaMask
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (account) {
    return (
      <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Wallet Connected</h3>
          </div>
          <div className="space-y-2">
            <p className="text-emerald-700">
              <span className="font-medium">Address:</span>{" "}
              {formatAddress(account)}
            </p>
            <p className="text-emerald-700">
              <span className="font-medium">Status:</span> Connected
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <button
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="w-full text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🦊</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900">MetaMask</h3>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                  Popular
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {isConnecting
                  ? "Connecting to MetaMask..."
                  : "Connect using MetaMask browser extension"}
              </p>
              <div className="flex flex-wrap gap-1">
                {["Ethereum", "Polygon", "BSC", "Arbitrum"].map((chain) => (
                  <span
                    key={chain}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                  >
                    {chain}
                  </span>
                ))}
              </div>
              {isConnecting && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-600">Connecting...</span>
                </div>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
