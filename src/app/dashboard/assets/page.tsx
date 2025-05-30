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
  FileCheck,
  MapPin,
  DollarSign,
  Calendar,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Shield,
  Coins,
  Building,
  CheckCircle,
  Wallet,
  Activity,
  Package,
  Home,
} from "lucide-react";
import Link from "next/link";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  description: string;
  current_value: number;
  original_value: number;
  verification_status: string;
  collateralization_status: string;
  location: string;
  blockchain: string;
  created_at: string;
}

function getStatusBadge(status: string) {
  const colors = {
    verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    collateralized: "bg-blue-50 text-blue-700 border-blue-200",
    available: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <Badge
      variant="outline"
      className={`${colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"} font-medium`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
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

export default async function AssetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalValue =
    assets?.reduce((sum, asset) => sum + asset.current_value, 0) || 0;
  const verifiedAssets =
    assets?.filter((asset) => asset.verification_status === "verified")
      .length || 0;
  const collateralizedAssets =
    assets?.filter(
      (asset) => asset.collateralization_status === "collateralized"
    ).length || 0;
  const pendingAssets =
    assets?.filter((asset) => asset.verification_status === "pending").length ||
    0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 animate-fadeIn">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slideDown">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Asset Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track and manage your tokenized real-world assets
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Link href="/dashboard/assets/new">
                <Plus className="h-5 w-5 mr-2" />
                Tokenize Asset
              </Link>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-staggerIn">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2 uppercase tracking-wide">
                  <Building className="h-5 w-5" />
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {assets?.length || 0}
                </p>
                <div className="flex items-center gap-1 text-blue-600 mt-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">NFTs Minted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-600 flex items-center gap-2 uppercase tracking-wide">
                  <DollarSign className="h-5 w-5" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalValue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-emerald-600 mt-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Portfolio Value</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-purple-600 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle className="h-5 w-5" />
                  Verified Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {verifiedAssets}
                </p>
                <div className="flex items-center gap-1 text-purple-600 mt-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready for Lending</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-orange-600 flex items-center gap-2 uppercase tracking-wide">
                  <Wallet className="h-5 w-5" />
                  Active Collateral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {collateralizedAssets}
                </p>
                <div className="flex items-center gap-1 text-orange-600 mt-2">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm font-medium">Currently Lending</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assets List */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-slideUp">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  Your Tokenized Assets
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {assets?.length || 0} total
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/assets/new">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Asset
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {assets && assets.length > 0 ? (
                assets.map((asset: Asset) => {
                  const valueChange =
                    asset.current_value - asset.original_value;
                  const valueChangePercent = (
                    (valueChange / asset.original_value) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={asset.id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 space-y-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {asset.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                            >
                              NFT
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {asset.blockchain}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {asset.asset_type} • {asset.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(asset.verification_status)}
                          {getStatusBadge(asset.collateralization_status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Current Value
                          </p>
                          <p className="font-bold text-lg text-gray-900">
                            ${asset.current_value.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Original Value
                          </p>
                          <p className="text-sm text-gray-600">
                            ${asset.original_value.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Value Change
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              valueChange >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {valueChange >= 0 ? "+" : ""}$
                            {valueChange.toLocaleString()} ({valueChangePercent}
                            %)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Tokenized {formatTimeAgo(asset.created_at)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                            asChild
                          >
                            <Link href={`/dashboard/assets/${asset.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                            asChild
                          >
                            <Link href={`/dashboard/assets/${asset.id}/edit`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCheck className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium mb-2">No assets found</p>
                  <p className="text-sm mb-6">
                    Start building your portfolio by tokenizing your first
                    real-world asset into an NFT
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/dashboard/assets/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Tokenize Your First Asset
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
