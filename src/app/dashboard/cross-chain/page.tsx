import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
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
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

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
    ethereum: "bg-blue-100 text-blue-800 border-blue-200",
    polygon: "bg-purple-100 text-purple-800 border-purple-200",
    binance: "bg-yellow-100 text-yellow-800 border-yellow-200",
    avalanche: "bg-red-100 text-red-800 border-red-200",
    arbitrum: "bg-cyan-100 text-cyan-800 border-cyan-200",
  };
  return (
    colors[blockchain as keyof typeof colors] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
}

function getPositionTypeColor(type: string) {
  const colors = {
    asset: "bg-green-100 text-green-800",
    stablecoin: "bg-blue-100 text-blue-800",
    lending: "bg-orange-100 text-orange-800",
    staking: "bg-purple-100 text-purple-800",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

export default async function CrossChainPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
      {} as Record<string, CrossChainPosition[]>,
    ) || {};

  const totalValue =
    positions?.reduce((sum, pos) => sum + pos.usd_value, 0) || 0;
  const totalChains = Object.keys(positionsByChain).length;
  const totalPositions = positions?.length || 0;
  const largestPosition = positions?.[0];

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Cross-Chain Activity Center
              </h1>
              <p className="text-muted-foreground mt-1">
                Unified view of your positions across multiple blockchains
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Balances
              </Button>
              <Button asChild>
                <Link href="/dashboard/cross-chain/connect">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">+5.2% (24h)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Active Chains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalChains}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalPositions}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Largest Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    ${largestPosition?.usd_value.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">
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
                0,
              );

              return (
                <Card key={blockchain} className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full border ${getBlockchainColor(blockchain)}`}
                        >
                          <span className="text-sm font-medium capitalize">
                            {blockchain}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            ${chainTotal.toLocaleString()}
                          </CardTitle>
                          <CardDescription>
                            {chainPositions.length} positions
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chainPositions.map((position) => (
                        <Card key={position.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {position.asset_symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {position.asset_symbol}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {position.asset_address.slice(0, 6)}...
                                    {position.asset_address.slice(-4)}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={getPositionTypeColor(
                                  position.position_type,
                                )}
                              >
                                {position.position_type}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  Balance
                                </span>
                                <span className="font-medium">
                                  {position.balance.toFixed(4)}{" "}
                                  {position.asset_symbol}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  USD Value
                                </span>
                                <span className="font-bold">
                                  ${position.usd_value.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">
                                  24h Change
                                </span>
                                <span className="text-green-600 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  +2.1%
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  Send
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  Swap
                                </Button>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground mt-3">
                              Updated{" "}
                              {new Date(position.updated_at).toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )}

          {/* Empty State */}
          {totalPositions === 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-12">
                <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No cross-chain positions found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Connect your wallets to view positions across different
                  blockchains
                </p>
                <Button asChild>
                  <Link href="/dashboard/cross-chain/connect">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Wallet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Network Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>
                Real-time status of supported blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    name: "Ethereum",
                    status: "online",
                    latency: "12ms",
                    gasPrice: "25 gwei",
                  },
                  {
                    name: "Polygon",
                    status: "online",
                    latency: "8ms",
                    gasPrice: "30 gwei",
                  },
                  {
                    name: "Binance Smart Chain",
                    status: "online",
                    latency: "15ms",
                    gasPrice: "5 gwei",
                  },
                  {
                    name: "Avalanche",
                    status: "online",
                    latency: "10ms",
                    gasPrice: "25 nAVAX",
                  },
                  {
                    name: "Arbitrum",
                    status: "online",
                    latency: "6ms",
                    gasPrice: "0.1 gwei",
                  },
                ].map((network) => (
                  <div key={network.name} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-sm">
                        {network.name}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Latency: {network.latency}</div>
                      <div>Gas: {network.gasPrice}</div>
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
