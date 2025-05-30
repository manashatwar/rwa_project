"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle,
  Globe,
  Sparkles,
  Info,
  Zap,
  Link as LinkIcon,
  ExternalLink,
  RefreshCw,
  Clock,
  Target,
} from "lucide-react";
import Link from "next/link";
import MetaMaskConnect from "@/components/metamask-connect";

interface WalletConnection {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  isConnected: boolean;
}

interface SupportedNetwork {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  logo: string;
  status: "live" | "beta" | "coming-soon";
  gasPrice: string;
  bridgeAvailable: boolean;
}

export default function CrossChainConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [walletConnections, setWalletConnections] = useState<
    WalletConnection[]
  >([]);
  const [selectedNetwork, setSelectedNetwork] = useState<number>(1);

  const supportedNetworks: SupportedNetwork[] = [
    {
      chainId: 1,
      name: "Ethereum",
      symbol: "ETH",
      rpcUrl: "https://ethereum.rpc.url",
      blockExplorer: "https://etherscan.io",
      logo: "🔷",
      status: "live",
      gasPrice: "~$15",
      bridgeAvailable: true,
    },
    {
      chainId: 137,
      name: "Polygon",
      symbol: "MATIC",
      rpcUrl: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com",
      logo: "🟣",
      status: "live",
      gasPrice: "~$0.01",
      bridgeAvailable: true,
    },
    {
      chainId: 56,
      name: "BNB Chain",
      symbol: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org",
      blockExplorer: "https://bscscan.com",
      logo: "🟡",
      status: "live",
      gasPrice: "~$0.15",
      bridgeAvailable: true,
    },
    {
      chainId: 42161,
      name: "Arbitrum",
      symbol: "ARB",
      rpcUrl: "https://arbitrum.rpc.url",
      blockExplorer: "https://arbiscan.io",
      logo: "🔵",
      status: "live",
      gasPrice: "~$1",
      bridgeAvailable: true,
    },
    {
      chainId: 10,
      name: "Optimism",
      symbol: "OP",
      rpcUrl: "https://optimism.rpc.url",
      blockExplorer: "https://optimistic.etherscan.io",
      logo: "🔴",
      status: "beta",
      gasPrice: "~$0.50",
      bridgeAvailable: false,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setUser(user);
      await checkWalletConnections();
      setLoading(false);
    };

    loadData();
  }, [router]);

  const checkWalletConnections = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (accounts.length > 0) {
          // Mock additional network connections for demo
          const connections: WalletConnection[] = [
            {
              address: accounts[0],
              chainId: parseInt(chainId, 16),
              chainName: getChainName(parseInt(chainId, 16)),
              balance: "2.5",
              isConnected: true,
            },
          ];
          setWalletConnections(connections);
        }
      } catch (error) {
        console.error("Error checking wallet connections:", error);
      }
    }
  };

  const getChainName = (chainId: number): string => {
    const network = supportedNetworks.find((n) => n.chainId === chainId);
    return network ? network.name : "Unknown Network";
  };

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      setSelectedNetwork(chainId);
      await checkWalletConnections();
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to wallet
        const network = supportedNetworks.find((n) => n.chainId === chainId);
        if (network) {
          await addNetwork(network);
        }
      }
    }
  };

  const addNetwork = async (network: SupportedNetwork) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer],
            nativeCurrency: {
              name: network.symbol,
              symbol: network.symbol,
              decimals: 18,
            },
          },
        ],
      });
      setSelectedNetwork(network.chainId);
      await checkWalletConnections();
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wallet connections...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 animate-fadeIn">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Enhanced Header with Back Button */}
          <div className="mb-8 animate-slideDown">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link
                  href="/dashboard/cross-chain"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cross-Chain
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Real-time network status</span>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Cross-Chain Wallet Hub
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect and manage your wallet across multiple blockchain
                networks for seamless asset transfers and trading
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-slideUp">
            {/* Main Content - Takes 3 columns */}
            <div className="xl:col-span-3 space-y-8">
              {/* Wallet Connection Status */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    Wallet Connection
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Connect your MetaMask wallet to access cross-chain
                    functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {walletConnections.length > 0 ? (
                    <div className="space-y-6">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>
                              Wallet connected:{" "}
                              {walletConnections[0].address.slice(0, 6)}...
                              {walletConnections[0].address.slice(-4)}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {walletConnections[0].chainName}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Current Network
                          </h4>
                          <p className="text-sm text-gray-600">
                            {walletConnections[0].chainName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Chain ID: {walletConnections[0].chainId}
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Wallet Balance
                          </h4>
                          <p className="text-sm text-gray-600">
                            {walletConnections[0].balance} ETH
                          </p>
                          <p className="text-sm text-gray-500">~$4,250 USD</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Connect Your Wallet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Connect your MetaMask wallet to access cross-chain
                        features
                      </p>
                      <MetaMaskConnect
                        variant="button"
                        onSuccess={() => checkWalletConnections()}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Supported Networks */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    Supported Networks
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Switch between different blockchain networks instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supportedNetworks.map((network) => (
                      <Card
                        key={network.chainId}
                        className={`border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                          selectedNetwork === network.chainId
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          network.status === "live" &&
                          switchNetwork(network.chainId)
                        }
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl">{network.logo}</div>
                            <Badge
                              variant="outline"
                              className={
                                network.status === "live"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : network.status === "beta"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {network.status}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">
                            {network.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {network.symbol}
                          </p>

                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex justify-between">
                              <span>Gas Fee:</span>
                              <span className="font-medium">
                                {network.gasPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bridge:</span>
                              <span
                                className={
                                  network.bridgeAvailable
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }
                              >
                                {network.bridgeAvailable
                                  ? "Available"
                                  : "Coming Soon"}
                              </span>
                            </div>
                          </div>

                          {network.status === "live" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-4"
                              onClick={() => switchNetwork(network.chainId)}
                            >
                              {selectedNetwork === network.chainId
                                ? "Connected"
                                : "Switch Network"}
                            </Button>
                          )}

                          {network.status === "coming-soon" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-4 opacity-50 cursor-not-allowed"
                              disabled
                            >
                              Coming Soon
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Network Actions */}
              {walletConnections.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Button
                        size="lg"
                        className="h-24 flex-col gap-2 bg-gradient-to-br from-blue-600 to-blue-700"
                        asChild
                      >
                        <Link href="/dashboard/cross-chain/bridge">
                          <LinkIcon className="h-6 w-6" />
                          <span>Bridge Assets</span>
                        </Link>
                      </Button>

                      <Button
                        size="lg"
                        className="h-24 flex-col gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700"
                        asChild
                      >
                        <Link href="/dashboard/cross-chain/swap">
                          <RefreshCw className="h-6 w-6" />
                          <span>Swap Tokens</span>
                        </Link>
                      </Button>

                      <Button
                        size="lg"
                        className="h-24 flex-col gap-2 bg-gradient-to-br from-purple-600 to-purple-700"
                        onClick={() => checkWalletConnections()}
                      >
                        <RefreshCw className="h-6 w-6" />
                        <span>Refresh Balance</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="xl:col-span-1 space-y-6">
              {/* Connection Status */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                    Connection Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-blue-500 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-blue-600">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          Connect Wallet
                        </h4>
                        <p className="text-sm text-gray-600">
                          Link your MetaMask to access networks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-gray-300 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-gray-500">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500">
                          Switch Networks
                        </h4>
                        <p className="text-sm text-gray-400">
                          Choose your preferred blockchain
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-gray-300 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-gray-500">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500">
                          Start Trading
                        </h4>
                        <p className="text-sm text-gray-400">
                          Bridge, swap, and manage assets
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
                    <Target className="h-5 w-5" />
                    Cross-Chain Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Low transaction fees
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Instant network switching
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Unified asset management
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Maximum liquidity access
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
                    <Shield className="h-5 w-5" />
                    Security Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-amber-800">
                    Always verify network details before switching chains.
                  </p>
                  <p className="text-sm text-amber-700">
                    Double-check transaction details and gas fees.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-300 text-amber-800 hover:bg-amber-100"
                    asChild
                  >
                    <Link href="#" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Security Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
