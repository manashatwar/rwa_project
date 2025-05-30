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
      (asset) => asset.collateralization_status === "collateralized",
    ).length || 0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Asset Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your tokenized real-world assets
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/assets/new">
                <Plus className="h-4 w-4 mr-2" />
                Tokenize Asset
              </Link>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{assets?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${totalValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Verified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{verifiedAssets}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collateralized
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{collateralizedAssets}</p>
              </CardContent>
            </Card>
          </div>

          {/* Assets Grid */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>
                All your tokenized real-world assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assets && assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        className="border hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">
                                {asset.name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {asset.location}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {asset.blockchain}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {asset.asset_type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {asset.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Current Value
                              </span>
                              <span className="font-bold">
                                ${asset.current_value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Original Value
                              </span>
                              <span>
                                ${asset.original_value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Change
                              </span>
                              <span
                                className={
                                  valueChange >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {valueChange >= 0 ? "+" : ""}$
                                {valueChange.toLocaleString()} (
                                {valueChangePercent}%)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              {getStatusBadge(asset.verification_status)}
                              {getStatusBadge(asset.collateralization_status)}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            Added{" "}
                            {new Date(asset.created_at).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No assets found</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by tokenizing your first real-world asset
                  </p>
                  <Button asChild>
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
