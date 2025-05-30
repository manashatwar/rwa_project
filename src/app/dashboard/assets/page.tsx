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
  const variants = {
    verified: "default" as const,
    pending: "secondary" as const,
    rejected: "destructive" as const,
    collateralized: "default" as const,
    available: "secondary" as const,
  };

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
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

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              size="lg"
            >
              <Link href="/dashboard/assets/new">
                <Plus className="h-5 w-5 mr-2" />
                Tokenize Asset
              </Link>
            </Button>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Assets Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-100">
                    Total Assets
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-3xl font-bold mb-1">{assets?.length || 0}</p>
                <p className="text-blue-100 text-sm">
                  {assets?.length === 1 ? "Asset" : "Assets"} tokenized
                </p>
              </CardContent>
            </Card>

            {/* Total Value Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-emerald-100">
                    Total Value
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-3xl font-bold mb-1">
                  ${totalValue.toLocaleString()}
                </p>
                <p className="text-emerald-100 text-sm flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Portfolio value
                </p>
              </CardContent>
            </Card>

            {/* Verified Assets Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-100">
                    Verified Assets
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-3xl font-bold mb-1">{verifiedAssets}</p>
                <p className="text-purple-100 text-sm">Ready for lending</p>
              </CardContent>
            </Card>

            {/* Collateralized Assets Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-100">
                    Active Collateral
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-3xl font-bold mb-1">
                  {collateralizedAssets}
                </p>
                <p className="text-orange-100 text-sm">Currently lending</p>
              </CardContent>
            </Card>
          </div>

          {/* Assets Grid */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Your Assets
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    All your tokenized real-world assets
                  </CardDescription>
                </div>
                {assets && assets.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {assets.length} {assets.length === 1 ? "asset" : "assets"}{" "}
                    found
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {assets && assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {assets.map((asset: Asset) => {
                    const valueChange =
                      asset.current_value - asset.original_value;
                    const valueChangePercent = (
                      (valueChange / asset.original_value) *
                      100
                    ).toFixed(1);

                    return (
                      <Card
                        key={asset.id}
                        className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white group"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                {asset.name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                {asset.location}
                              </CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
                            >
                              {asset.blockchain}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <p className="text-sm font-semibold text-blue-600 mb-1">
                              {asset.asset_type}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {asset.description}
                            </p>
                          </div>

                          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Current Value
                              </span>
                              <span className="font-bold text-lg text-gray-900">
                                ${asset.current_value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Original Value
                              </span>
                              <span className="text-gray-600">
                                ${asset.original_value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
                              <span className="text-muted-foreground">
                                Change
                              </span>
                              <span
                                className={
                                  valueChange >= 0
                                    ? "text-emerald-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                }
                              >
                                {valueChange >= 0 ? "+" : ""}$
                                {valueChange.toLocaleString()} (
                                {valueChangePercent}%)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(asset.verification_status)}
                            {getStatusBadge(asset.collateralization_status)}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                              asChild
                            >
                              <Link href={`/dashboard/assets/${asset.id}`}>
                                <Eye className="h-4 w-4 mr-1.5" />
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
                              asChild
                            >
                              <Link href={`/dashboard/assets/${asset.id}/edit`}>
                                <Edit className="h-4 w-4 mr-1.5" />
                                Edit
                              </Link>
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground pt-3 border-t border-gray-100 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Added{" "}
                            {new Date(asset.created_at).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <FileCheck className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    No assets found
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                    Start building your portfolio by tokenizing your first
                    real-world asset
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    size="lg"
                  >
                    <Link href="/dashboard/assets/new">
                      <Plus className="h-5 w-5 mr-2" />
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
