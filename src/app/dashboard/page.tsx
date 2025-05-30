import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  DollarSign,
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  current_value: number;
  verification_status: string;
  collateralization_status: string;
  location: string;
  blockchain: string;
  created_at: string;
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
  created_at: string;
}

interface CrossChainPosition {
  id: string;
  blockchain: string;
  asset_symbol: string;
  balance: number;
  usd_value: number;
  position_type: string;
  updated_at: string;
}

function getStatusBadge(status: string) {
  const statusConfig = {
    verified: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    rejected: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    active: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    collateralized: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    available: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border`}
    >
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function calculateHealthRatio(
  totalCollateral: number,
  totalDebt: number
): number {
  if (totalDebt === 0) return 5.0;
  return totalCollateral / totalDebt;
}

function getHealthStatus(ratio: number) {
  if (ratio >= 2.0)
    return {
      status: "Excellent",
      color: "text-green-600",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  if (ratio >= 1.5)
    return {
      status: "Good",
      color: "text-blue-600",
      icon: TrendingUp,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    };
  if (ratio >= 1.2)
    return {
      status: "Warning",
      color: "text-yellow-600",
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  return {
    status: "Critical",
    color: "text-red-600",
    icon: TrendingDown,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

async function refreshPortfolioAction() {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock portfolio refresh - in reality, this would sync with various blockchain networks
  console.log("Refreshing portfolio data for user:", user.id);

  return redirect("/dashboard?refreshed=true");
}

async function searchPortfolioAction(formData: FormData) {
  "use server";

  const searchQuery = formData.get("search") as string;
  if (searchQuery && searchQuery.trim()) {
    return redirect(
      `/dashboard?search=${encodeURIComponent(searchQuery.trim())}`
    );
  }
  return redirect("/dashboard");
}

async function quickAddAssetAction() {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // This would typically redirect to an asset creation form
  return redirect("/dashboard/assets/new?quick=true");
}

async function quickPaymentAction() {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // This would typically redirect to payment form with pre-filled upcoming payments
  return redirect("/dashboard/payments?quick=true");
}

export default async function Dashboard({
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
  const searchQuery = (params.search as string) || "";

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
    .order("updated_at", { ascending: false });

  // Filter data based on search query
  const filteredAssets =
    assets?.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.asset_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredLoans =
    loans?.filter(
      (loan) =>
        loan.blockchain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.loan_status.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredPositions =
    positions?.filter(
      (position) =>
        position.asset_symbol
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        position.blockchain.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
    totalLoanBalance
  );
  const healthStatus = getHealthStatus(healthRatio);
  const HealthIcon = healthStatus.icon;

  // Calculate recent activity metrics
  const recentAssetsCount =
    assets?.filter((asset) => {
      const createdDate = new Date(asset.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length || 0;

  const upcomingPayments =
    loans?.filter((loan) => {
      const paymentDate = new Date(loan.next_payment_date);
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return paymentDate <= sevenDaysFromNow && loan.loan_status === "active";
    }).length || 0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header Section */}
          <header className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Portfolio Dashboard
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Manage your tokenized real-world assets and lending activities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={refreshPortfolioAction}>
                  <SubmitButton
                    variant="outline"
                    size="lg"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Portfolio
                  </SubmitButton>
                </form>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm ${healthStatus.bgColor} ${healthStatus.borderColor}`}
                >
                  <HealthIcon className={`h-5 w-5 ${healthStatus.color}`} />
                  <span
                    className={`text-sm font-semibold ${healthStatus.color}`}
                  >
                    {healthStatus.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <form
                action={searchPortfolioAction}
                className="relative flex-1 max-w-md"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search assets, loans, positions..."
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  defaultValue={searchQuery}
                />
              </form>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 30 days
                </Button>
                {searchQuery && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">Clear Search</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Search Results Indicator */}
            {searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Search results for "{searchQuery}"
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {filteredAssets.length +
                      filteredLoans.length +
                      filteredPositions.length}{" "}
                    items found
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showRefreshed && (
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold text-emerald-900">
                        Portfolio Synced!
                      </h3>
                      <p className="text-emerald-700">
                        Your portfolio data has been updated across all
                        connected networks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Multi-Chain Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="flex gap-4">
                <InfoIcon className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Multi-Chain Asset Management
                  </p>
                  <p className="text-sm text-blue-700">
                    Your assets and positions are tracked across Ethereum,
                    Polygon, and other supported networks
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {recentAssetsCount} assets added this month
                    </Badge>
                    {upcomingPayments > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        {upcomingPayments} payments due soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Financial Health Summary */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2 uppercase tracking-wide">
                  <Wallet className="h-5 w-5" />
                  Total Collateral Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalCollateralValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium text-sm">
                      +2.5% from last month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {assets?.length || 0} tokenized assets
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-orange-600 flex items-center gap-2 uppercase tracking-wide">
                  <Landmark className="h-5 w-5" />
                  Outstanding Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalLoanBalance.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium text-sm">
                      -1.2% from last month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loans?.length || 0} active loans
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-0 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 ${healthStatus.bgColor}`}
            >
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-sm font-semibold flex items-center gap-2 uppercase tracking-wide ${healthStatus.color}`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Health Ratio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className={`text-3xl font-bold ${healthStatus.color}`}>
                    {healthRatio.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <HealthIcon className={`h-4 w-4 ${healthStatus.color}`} />
                    <span
                      className={`${healthStatus.color} font-medium text-sm`}
                    >
                      {healthStatus.status} standing
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {healthRatio >= 2.0
                      ? "Very safe"
                      : healthRatio >= 1.5
                        ? "Safe"
                        : "Monitor closely"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-600 flex items-center gap-2 uppercase tracking-wide">
                  <DollarSign className="h-5 w-5" />
                  Net Worth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-gray-900">
                    ${netWorth.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium text-sm">
                      +3.1% from last month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Including crypto positions
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Enhanced Assets and Loans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Assets Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                    Tokenized Assets
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {filteredAssets.length}{" "}
                      {searchQuery ? "filtered" : "total"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/assets">
                        View All
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {filteredAssets && filteredAssets.length > 0 ? (
                  filteredAssets.slice(0, 3).map((asset: Asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">
                          {asset.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {asset.asset_type} • {asset.location}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(asset.verification_status)}
                          <Badge variant="outline" className="text-xs bg-white">
                            {asset.blockchain}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Added {formatTimeAgo(asset.created_at)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-lg text-gray-900">
                          ${asset.current_value.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {asset.collateralization_status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileCheck className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium mb-2">
                      {searchQuery
                        ? "No matching assets found"
                        : "No assets found"}
                    </p>
                    <p className="text-sm mb-6">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "Start by tokenizing your first real-world asset"}
                    </p>
                    {!searchQuery && (
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/dashboard/assets/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Tokenize Asset
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Loans Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Landmark className="h-6 w-6 text-orange-600" />
                    Active Loans
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {filteredLoans.length}{" "}
                      {searchQuery ? "filtered" : "total"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/loans">
                        View All
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {filteredLoans && filteredLoans.length > 0 ? (
                  filteredLoans.slice(0, 3).map((loan: Loan) => {
                    const paymentProgress =
                      ((loan.loan_amount - loan.outstanding_balance) /
                        loan.loan_amount) *
                      100;
                    const isPaymentDue =
                      new Date(loan.next_payment_date) <= new Date();

                    return (
                      <div
                        key={loan.id}
                        className="p-4 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-200 space-y-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">
                              ${loan.loan_amount.toLocaleString()} Loan
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {loan.interest_rate}% APR • {loan.blockchain}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(loan.loan_status)}
                            {isPaymentDue && (
                              <Badge variant="destructive" className="text-xs">
                                Payment Due
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Outstanding: $
                              {loan.outstanding_balance.toLocaleString()}
                            </span>
                            <span className="font-medium">
                              Next: ${loan.monthly_payment.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={paymentProgress} className="h-2" />
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              Next payment:{" "}
                              {new Date(
                                loan.next_payment_date
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {paymentProgress.toFixed(1)}% paid off
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Landmark className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium mb-2">
                      {searchQuery
                        ? "No matching loans found"
                        : "No active loans"}
                    </p>
                    <p className="text-sm mb-6">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "Use your assets as collateral to secure loans"}
                    </p>
                    {!searchQuery && (
                      <Button
                        asChild
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <Link href="/dashboard/loans/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Apply for Loan
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Cross-Chain Positions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="h-6 w-6 text-emerald-600" />
                  Cross-Chain Positions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {filteredPositions.length}{" "}
                    {searchQuery ? "filtered" : "total"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/cross-chain">
                      View All
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPositions && filteredPositions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPositions
                    .slice(0, 6)
                    .map((position: CrossChainPosition) => (
                      <div
                        key={position.id}
                        className="p-6 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-sm font-bold text-white">
                                {position.asset_symbol.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {position.asset_symbol}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {position.blockchain}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize bg-white"
                          >
                            {position.position_type}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-gray-900">
                            ${position.usd_value.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {position.balance.toFixed(4)}{" "}
                            {position.asset_symbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Updated {formatTimeAgo(position.updated_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium mb-2">
                    {searchQuery
                      ? "No matching positions found"
                      : "No cross-chain positions"}
                  </p>
                  <p className="text-sm mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Connect your wallets to view positions across different blockchains"}
                  </p>
                  {!searchQuery && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Link href="/dashboard/cross-chain/connect">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-base">
                Common tasks and shortcuts to manage your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  asChild
                >
                  <Link href="/dashboard/assets/new">
                    <FileCheck className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Tokenize Asset</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 group"
                  asChild
                >
                  <Link href="/dashboard/payments">
                    <Coins className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Make Payment</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                  asChild
                >
                  <Link href="/dashboard/loans/new">
                    <Landmark className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Request Loan</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 group"
                  asChild
                >
                  <Link href="/dashboard/cross-chain">
                    <Globe className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Cross-Chain</span>
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
