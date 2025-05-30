import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
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
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  FileText,
  Shield,
  Wallet,
  Activity,
  BarChart3,
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

export default async function AssetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: asset, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !asset) {
    return notFound();
  }

  const valueChange = asset.current_value - asset.original_value;
  const valueChangePercent = (
    (valueChange / asset.original_value) *
    100
  ).toFixed(1);
  const isPositive = valueChange >= 0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild className="shadow-sm">
                <Link href="/dashboard/assets">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Assets
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  {asset.name}
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {asset.location}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              size="lg"
            >
              <Link href={`/dashboard/assets/${asset.id}/edit`}>
                <Edit className="h-5 w-5 mr-2" />
                Edit Asset
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Asset Overview */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="h-6 w-6 text-blue-600" />
                    Asset Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-6">
                      <h3 className="font-semibold text-sm text-blue-600 mb-3 uppercase tracking-wide">
                        Asset Type
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        {asset.asset_type}
                      </p>
                    </div>
                    <div className="border border-purple-200 bg-purple-50/30 rounded-lg p-6">
                      <h3 className="font-semibold text-sm text-purple-600 mb-3 uppercase tracking-wide">
                        Blockchain
                      </h3>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <span className="text-xl font-bold text-gray-900 capitalize">
                          {asset.blockchain}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6">
                    <h3 className="font-semibold text-sm text-gray-600 mb-4 uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {asset.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 pt-4 border-t border-gray-100">
                    <Calendar className="h-5 w-5" />
                    <span className="text-base">
                      Added{" "}
                      {new Date(asset.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Valuation */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                    Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center border border-emerald-200 bg-emerald-50/30 rounded-xl p-6">
                      <p className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wide">
                        Current Value
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        ${asset.current_value.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-emerald-600">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm font-medium">Live Value</span>
                      </div>
                    </div>
                    <div className="text-center border border-gray-200 bg-gray-50/30 rounded-xl p-6">
                      <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        Original Value
                      </p>
                      <p className="text-3xl font-bold text-gray-700 mb-2">
                        ${asset.original_value.toLocaleString()}
                      </p>
                      <span className="text-sm text-gray-500">
                        Initial Investment
                      </span>
                    </div>
                    <div className="text-center border border-blue-200 bg-blue-50/30 rounded-xl p-6">
                      <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">
                        Change
                      </p>
                      <div
                        className={`flex items-center justify-center gap-2 mb-2 ${
                          isPositive ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        <span className="text-2xl font-bold">
                          {isPositive ? "+" : ""}${valueChange.toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        ({valueChangePercent}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Verification Status
                    </p>
                    {getStatusBadge(asset.verification_status)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Collateralization Status
                    </p>
                    {getStatusBadge(asset.collateralization_status)}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    Available Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {asset.verification_status === "verified" &&
                    asset.collateralization_status === "available" && (
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md"
                        size="lg"
                      >
                        Use as Collateral
                      </Button>
                    )}

                  {asset.collateralization_status === "collateralized" && (
                    <Button className="w-full" variant="outline" size="lg">
                      View Loan Details
                    </Button>
                  )}

                  <Button className="w-full" variant="outline" size="lg">
                    Request Revaluation
                  </Button>

                  <Button className="w-full" variant="outline" size="lg">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Asset Details */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Asset Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Asset ID
                    </span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {asset.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Network
                    </span>
                    <span className="capitalize font-semibold">
                      {asset.blockchain}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Created
                    </span>
                    <span className="font-semibold">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-gray-900">
                    Need Assistance?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Our support team can help with asset management and lending
                    options.
                  </p>
                  <Button variant="outline" size="lg" className="w-full">
                    Contact Support
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
