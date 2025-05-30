import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Coins,
  FileCheck,
  Globe,
  Landmark,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  current_value: number;
  verification_status: string;
  collateralization_status: string;
  location: string;
  blockchain: string;
}

interface Loan {
  id: string;
  loan_amount: number;
  outstanding_balance: number;
  interest_rate: number;
  monthly_payment: number;
  next_payment_date: string;
  loan_status: string;
  blockchain: string;
}

interface CrossChainPosition {
  id: string;
  blockchain: string;
  asset_symbol: string;
  balance: number;
  usd_value: number;
  position_type: string;
}

function getStatusBadge(status: string) {
  const statusConfig = {
    verified: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    },
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600",
    },
    rejected: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-600",
    },
    active: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    },
    collateralized: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-blue-600",
    },
    available: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-gray-600",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function calculateHealthRatio(
  totalCollateral: number,
  totalDebt: number,
): number {
  if (totalDebt === 0) return 5.0;
  return totalCollateral / totalDebt;
}

function getHealthStatus(ratio: number) {
  if (ratio >= 2.0)
    return { status: "Excellent", color: "text-green-600", icon: CheckCircle };
  if (ratio >= 1.5)
    return { status: "Good", color: "text-blue-600", icon: TrendingUp };
  if (ratio >= 1.2)
    return { status: "Warning", color: "text-yellow-600", icon: AlertTriangle };
  return { status: "Critical", color: "text-red-600", icon: TrendingDown };
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's assets
  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch user's loans
  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch cross-chain positions
  const { data: positions } = await supabase
    .from("cross_chain_positions")
    .select("*")
    .eq("user_id", user.id)
    .order("blockchain", { ascending: true });

  // Calculate portfolio metrics
  const totalCollateralValue =
    assets?.reduce((sum, asset) => sum + asset.current_value, 0) || 0;
  const totalLoanBalance =
    loans?.reduce((sum, loan) => sum + loan.outstanding_balance, 0) || 0;
  const totalCryptoValue =
    positions?.reduce((sum, pos) => sum + pos.usd_value, 0) || 0;
  const netWorth = totalCollateralValue + totalCryptoValue - totalLoanBalance;
  const healthRatio = calculateHealthRatio(
    totalCollateralValue,
    totalLoanBalance,
  );
  const healthStatus = getHealthStatus(healthRatio);
  const HealthIcon = healthStatus.icon;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header Section */}
          <header className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Portfolio Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your tokenized real-world assets and lending activities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${healthRatio >= 2.0 ? "bg-green-50 border-green-200" : healthRatio >= 1.5 ? "bg-blue-50 border-blue-200" : healthRatio >= 1.2 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}
                >
                  <HealthIcon className={`h-4 w-4 ${healthStatus.color}`} />
                  <span className={`text-sm font-medium ${healthStatus.color}`}>
                    {healthStatus.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Multi-Chain Asset Management
                  </p>
                  <p className="text-sm text-blue-700">
                    Your assets and positions are tracked across Ethereum,
                    Polygon, and other supported networks
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Financial Health Summary */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Total Collateral Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${totalCollateralValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">
                      +2.5% from last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  Outstanding Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${totalLoanBalance.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">-1.2% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Health Ratio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className={`text-2xl font-bold ${healthStatus.color}`}>
                    {healthRatio.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <HealthIcon className={`h-4 w-4 ${healthStatus.color}`} />
                    <span className={healthStatus.color}>
                      {healthStatus.status} standing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Net Worth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${netWorth.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">
                      +3.1% from last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Assets and Loans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assets Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Tokenized Assets
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/assets">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {assets && assets.length > 0 ? (
                  assets.slice(0, 3).map((asset: Asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.asset_type} • {asset.location}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(asset.verification_status)}
                          <Badge variant="outline" className="text-xs">
                            {asset.blockchain}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${asset.current_value.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {asset.collateralization_status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assets found</p>
                    <p className="text-sm">
                      Start by tokenizing your first real-world asset
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loans Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Active Loans
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/loans">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loans && loans.length > 0 ? (
                  loans.slice(0, 3).map((loan: Loan) => {
                    const paymentProgress =
                      ((loan.loan_amount - loan.outstanding_balance) /
                        loan.loan_amount) *
                      100;
                    return (
                      <div
                        key={loan.id}
                        className="p-4 bg-gray-50/50 rounded-lg border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              ${loan.loan_amount.toLocaleString()} Loan
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {loan.interest_rate}% APR • {loan.blockchain}
                            </p>
                          </div>
                          {getStatusBadge(loan.loan_status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              Outstanding: $
                              {loan.outstanding_balance.toLocaleString()}
                            </span>
                            <span>
                              Next: ${loan.monthly_payment.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={paymentProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Next payment:{" "}
                            {new Date(
                              loan.next_payment_date,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Landmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active loans</p>
                    <p className="text-sm">
                      Use your assets as collateral to secure loans
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cross-Chain Positions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cross-Chain Positions
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/cross-chain">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {positions && positions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positions.map((position: CrossChainPosition) => (
                    <div
                      key={position.id}
                      className="p-4 bg-gray-50/50 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              {position.asset_symbol}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {position.asset_symbol}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {position.blockchain}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {position.position_type}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          ${position.usd_value.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {position.balance.toFixed(4)} {position.asset_symbol}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No cross-chain positions</p>
                  <p className="text-sm">
                    Connect your wallets to view positions across different
                    blockchains
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  asChild
                >
                  <Link href="/dashboard/assets/new">
                    <FileCheck className="h-6 w-6" />
                    <span className="text-sm">Tokenize Asset</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  asChild
                >
                  <Link href="/dashboard/payments">
                    <Coins className="h-6 w-6" />
                    <span className="text-sm">Make Payment</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  asChild
                >
                  <Link href="/dashboard/loans/new">
                    <Landmark className="h-6 w-6" />
                    <span className="text-sm">Request Loan</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  asChild
                >
                  <Link href="/dashboard/cross-chain">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">Cross-Chain</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
