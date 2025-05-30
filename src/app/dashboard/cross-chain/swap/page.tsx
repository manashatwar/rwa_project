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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUpDown,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity,
  TrendingUp,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function SwapPage() {
  const router = useRouter();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

      // Fetch user's positions for selection
      const { data: positions } = await supabase
        .from("cross_chain_positions")
        .select("*")
        .eq("user_id", user.id)
        .order("usd_value", { ascending: false });

      setPositions(positions || []);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleSubmit = async (formData: FormData) => {
    if (!user) return;

    const fromAssetId = formData.get("from_asset_id") as string;
    const toAssetSymbol = formData.get("to_asset_symbol") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const slippage = formData.get("slippage") as string;

    // Mock transaction - in reality, this would interact with DEX protocols
    const transactionHash = "0x" + Math.random().toString(16).substring(2, 66);

    // Here you would implement actual DEX interaction logic
    console.log("Swapping assets:", {
      fromAssetId,
      toAssetSymbol,
      amount,
      slippage,
      transactionHash,
    });

    toast({
      title: "Swap Initiated",
      description: "Your asset swap has been initiated.",
    });

    router.push("/dashboard/cross-chain?swapped=true");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  const availableTokens = [
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "WBTC", name: "Wrapped Bitcoin" },
    { symbol: "MATIC", name: "Polygon" },
    { symbol: "LINK", name: "Chainlink" },
    { symbol: "UNI", name: "Uniswap" },
    { symbol: "AAVE", name: "Aave" },
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="shadow-sm">
              <Link href="/dashboard/cross-chain">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cross-Chain
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Swap Assets
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Exchange your assets at the best rates across chains
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ArrowUpDown className="h-6 w-6 text-blue-600" />
                    Exchange Details
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure your asset swap
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form action={handleSubmit} className="space-y-8">
                    {/* From Asset */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <DollarSign className="h-4 w-4" />
                        From Asset *
                      </Label>
                      <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              Asset
                            </Label>
                            <Select name="from_asset_id" required>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select asset to swap" />
                              </SelectTrigger>
                              <SelectContent>
                                {positions?.map((position) => (
                                  <SelectItem
                                    key={position.id}
                                    value={position.id}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-medium">
                                        {position.asset_symbol}
                                      </span>
                                      <span className="text-sm text-muted-foreground ml-4">
                                        {position.balance.toFixed(4)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              Amount
                            </Label>
                            <Input
                              name="amount"
                              type="number"
                              step="0.000001"
                              min="0"
                              placeholder="0.0"
                              required
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Available Balance:
                          </span>
                          <span className="font-medium">15,000.0000 USDC</span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Direction Indicator */}
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border border-gray-200 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowUpDown className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>

                    {/* To Asset */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        To Asset *
                      </Label>
                      <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              Asset
                            </Label>
                            <Select name="to_asset_symbol" required>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select asset to receive" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTokens.map((token) => (
                                  <SelectItem
                                    key={token.symbol}
                                    value={token.symbol}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-medium">
                                        {token.symbol}
                                      </span>
                                      <span className="text-sm text-muted-foreground ml-4">
                                        {token.name}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              You'll receive
                            </Label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              disabled
                              className="h-12 border-gray-200 bg-gray-100"
                              value="0.045"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Exchange Rate:
                          </span>
                          <span className="font-medium">
                            1 USDC = 0.000045 ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Settings */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Slippage Tolerance
                      </Label>
                      <Select name="slippage" defaultValue="0.5">
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.1">0.1%</SelectItem>
                          <SelectItem value="0.5">0.5%</SelectItem>
                          <SelectItem value="1.0">1.0%</SelectItem>
                          <SelectItem value="3.0">3.0%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 space-y-3">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Swap Summary
                      </h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">
                          1 USDC = 0.000045 ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Price Impact:
                        </span>
                        <span className="font-medium text-emerald-600">
                          {"<0.01%"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Network Fee:
                        </span>
                        <span className="font-medium">~$15.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated Time:
                        </span>
                        <span className="font-medium">30 seconds</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex gap-4">
                      <Button
                        type="submit"
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Execute Swap
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 px-8"
                        asChild
                      >
                        <Link href="/dashboard/cross-chain">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Market Info */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <CardHeader className="border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Market Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ETH Price:</span>
                      <span className="font-medium">$2,234.56</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h Change:</span>
                      <span className="font-medium text-emerald-600">
                        +2.45%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Liquidity:</span>
                      <span className="font-medium">$45.2M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Volume (24h):
                      </span>
                      <span className="font-medium">$12.8M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
                <CardHeader className="border-b border-emerald-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Check market conditions before large swaps</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Consider slippage for volatile assets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Monitor gas fees during high congestion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Start with smaller amounts for testing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Speed & Efficiency */}
              <Card className="border border-purple-200 shadow-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                <CardHeader className="border-b border-purple-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Speed & Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Fast Execution</p>
                        <p className="text-xs text-muted-foreground">
                          Swaps in under 30 seconds
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-medium text-sm">Optimal Pricing</p>
                        <p className="text-xs text-muted-foreground">
                          Best rates across DEXs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">MEV Protection</p>
                        <p className="text-xs text-muted-foreground">
                          Protected from front-running
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <Card className="border border-yellow-200 shadow-lg bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
                <CardHeader className="border-b border-yellow-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Important
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cryptocurrency swaps are irreversible. Always double-check
                    the amounts and assets before confirming.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
