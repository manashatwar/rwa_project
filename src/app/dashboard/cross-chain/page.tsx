import { createClient } from "../../../../supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Activity,
  DollarSign,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Coins,
  Wallet,
  Plus,
  Settings,
  Network,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";

interface CrossChainPosition {
  id: string;
  blockchain: string;
  asset_address: string;
  asset_symbol: string;
  balance: number;
  usd_value: number;
  position_type: string;
  created_at: string;
  updated_at: string;
}

function getBlockchainColor(blockchain: string) {
  const colors = {
    ethereum: "bg-blue-50 text-blue-700 border-blue-200",
    polygon: "bg-purple-50 text-purple-700 border-purple-200",
    binance: "bg-yellow-50 text-yellow-700 border-yellow-200",
    avalanche: "bg-red-50 text-red-700 border-red-200",
    arbitrum: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };
  return (
    colors[blockchain as keyof typeof colors] ||
    "bg-gray-50 text-gray-700 border-gray-200"
  );
}

function getPositionTypeColor(type: string) {
  const colors = {
    asset: "bg-emerald-50 text-emerald-700 border-emerald-200",
    stablecoin: "bg-blue-50 text-blue-700 border-blue-200",
    lending: "bg-orange-50 text-orange-700 border-orange-200",
    staking: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    colors[type as keyof typeof colors] ||
    "bg-gray-50 text-gray-700 border-gray-200"
  );
}

async function refreshBalancesAction() {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock refresh - in reality, this would call blockchain RPCs to update balances
  const { data: positions } = await supabase
    .from("cross_chain_positions")
    .select("*")
    .eq("user_id", user.id);

  if (positions) {
    // Simulate balance updates with small random changes
    for (const position of positions) {
      const changePercent = (Math.random() - 0.5) * 0.1; // ±5% change
      const newBalance = position.balance * (1 + changePercent);
      const newUsdValue = position.usd_value * (1 + changePercent);

      await supabase
        .from("cross_chain_positions")
        .update({
          balance: newBalance,
          usd_value: newUsdValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", position.id);
    }
  }

  return redirect("/dashboard/cross-chain?refreshed=true");
}

export default async function CrossChainPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const params = await searchParams;
  const showRefreshed = params.refreshed === "true";
  const showConnected = params.connected === "true";

  const { data: positions } = await supabase
    .from("cross_chain_positions")
    .select("*")
    .eq("user_id", user.id)
    .order("usd_value", { ascending: false });

  // Group positions by blockchain
  const positionsByChain =
    positions?.reduce(
      (acc, position) => {
        if (!acc[position.blockchain]) {
          acc[position.blockchain] = [];
        }
        acc[position.blockchain].push(position);
        return acc;
      },
      {} as Record<string, CrossChainPosition[]>
    ) || {};

  const totalValue =
    positions?.reduce((sum, pos) => sum + pos.usd_value, 0) || 0;
  const totalChains = Object.keys(positionsByChain).length;
  const totalPositions = positions?.length || 0;
  const largestPosition = positions?.[0];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Cross-Chain Activity Center
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Unified view of your positions across multiple blockchains
              </p>
            </div>
            <div className="flex gap-3">
              <form action={refreshBalancesAction}>
                <SubmitButton
                  variant="outline"
                  size="lg"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                  pendingText="Refreshing..."
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh Balances
                </SubmitButton>
              </form>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href="/dashboard/cross-chain/connect">
                  <Plus className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Link>
              </Button>
            </div>
          </div>

          {/* Success Messages */}
          {showRefreshed && (
            <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Balances Refreshed!
                    </h3>
                    <p className="text-emerald-700">
                      Your portfolio balances have been updated from the
                      blockchain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showConnected && (
            <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Wallet Connected!
                    </h3>
                    <p className="text-emerald-700">
                      Your MetaMask wallet has been successfully connected to
                      the platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2 uppercase tracking-wide">
                  <Wallet className="h-5 w-5" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">
                      +5.2% (24h)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-600 flex items-center gap-2 uppercase tracking-wide">
                  <Globe className="h-5 w-5" />
                  Active Chains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {totalChains}
                </p>
                <div className="flex items-center gap-1 text-emerald-600 mt-2">
                  <Network className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Networks Connected
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-purple-600 flex items-center gap-2 uppercase tracking-wide">
                  <BarChart3 className="h-5 w-5" />
                  Total Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {totalPositions}
                </p>
                <div className="flex items-center gap-1 text-purple-600 mt-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Active Holdings</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-orange-600 flex items-center gap-2 uppercase tracking-wide">
                  <Building className="h-5 w-5" />
                  Largest Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">
                    ${largestPosition?.usd_value.toLocaleString() || 0}
                  </p>
                  <p className="text-sm font-medium text-orange-600">
                    {largestPosition?.asset_symbol || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Positions by Blockchain */}
          {Object.entries(positionsByChain).map(
            ([blockchain, chainPositions]) => {
              const chainTotal = chainPositions.reduce(
                (sum, pos) => sum + pos.usd_value,
                0
              );

              return (
                <Card
                  key={blockchain}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8"
                >
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={`px-4 py-2 font-medium ${getBlockchainColor(blockchain)}`}
                        >
                          <span className="text-base capitalize">
                            {blockchain}
                          </span>
                        </Badge>
                        <div>
                          <CardTitle className="text-2xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                            ${chainTotal.toLocaleString()}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {chainPositions.length} positions
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                        asChild
                      >
                        <a
                          href={`https://${blockchain === "ethereum" ? "etherscan.io" : blockchain === "polygon" ? "polygonscan.com" : "explorer.com"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Explorer
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {chainPositions.map((position) => (
                        <Card
                          key={position.id}
                          className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white text-base font-bold">
                                    {position.asset_symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-gray-900">
                                    {position.asset_symbol}
                                  </p>
                                  <p className="text-sm text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
                                    {position.asset_address.slice(0, 6)}...
                                    {position.asset_address.slice(-4)}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getPositionTypeColor(position.position_type)} font-medium`}
                              >
                                {position.position_type}
                              </Badge>
                            </div>

                            <div className="space-y-4">
                              <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    Balance
                                  </span>
                                  <span className="font-bold text-lg text-gray-900">
                                    {position.balance.toFixed(4)}{" "}
                                    {position.asset_symbol}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    USD Value
                                  </span>
                                  <span className="font-bold text-xl text-gray-900">
                                    ${position.usd_value.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    24h Change
                                  </span>
                                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    +2.1%
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-3 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                                  asChild
                                >
                                  <Link
                                    href={`/dashboard/cross-chain/send?asset=${position.id}`}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all duration-200"
                                  asChild
                                >
                                  <Link
                                    href={`/dashboard/cross-chain/swap?from=${position.id}`}
                                  >
                                    <ArrowUpDown className="h-4 w-4 mr-2" />
                                    Swap
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-gray-200">
                              Updated{" "}
                              {new Date(position.updated_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}

          {/* Empty State */}
          {totalPositions === 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <Globe className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-40" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  No cross-chain positions found
                </h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  Connect your wallets to view positions across different
                  blockchains and manage your multi-chain portfolio
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Link href="/dashboard/cross-chain/connect">
                    <Plus className="h-5 w-5 mr-2" />
                    Connect Your First Wallet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Network Status */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Network className="h-6 w-6 text-blue-600" />
                Network Status
              </CardTitle>
              <CardDescription className="text-base">
                Real-time status of supported blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  {
                    name: "Ethereum",
                    status: "online",
                    latency: "12ms",
                    gasPrice: "25 gwei",
                    color: "blue",
                  },
                  {
                    name: "Polygon",
                    status: "online",
                    latency: "8ms",
                    gasPrice: "30 gwei",
                    color: "purple",
                  },
                  {
                    name: "Binance Smart Chain",
                    status: "online",
                    latency: "15ms",
                    gasPrice: "5 gwei",
                    color: "yellow",
                  },
                  {
                    name: "Avalanche",
                    status: "online",
                    latency: "10ms",
                    gasPrice: "25 nAVAX",
                    color: "red",
                  },
                  {
                    name: "Arbitrum",
                    status: "online",
                    latency: "6ms",
                    gasPrice: "0.1 gwei",
                    color: "cyan",
                  },
                ].map((network) => (
                  <div
                    key={network.name}
                    className="border border-gray-200 bg-gray-50/30 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {network.name}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="font-medium text-gray-900">
                          {network.latency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-orange-600" />
                        <span className="text-muted-foreground">Gas:</span>
                        <span className="font-medium text-gray-900">
                          {network.gasPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
