import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../../supabase/server";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  DollarSign,
  Globe,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";

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

async function updateAssetAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const assetType = formData.get("asset_type") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const currentValue = parseFloat(formData.get("current_value") as string);
  const blockchain = formData.get("blockchain") as string;

  const { error } = await supabase
    .from("assets")
    .update({
      name,
      asset_type: assetType,
      description,
      location,
      current_value: currentValue,
      blockchain,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating asset:", error);
    return;
  }

  return redirect(`/dashboard/assets/${id}`);
}

export default async function EditAssetPage({
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

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="shadow-sm">
              <Link href={`/dashboard/assets/${asset.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Asset
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Edit Asset
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Update information for {asset.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="h-6 w-6 text-blue-600" />
                    Asset Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Update the details of your tokenized asset
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form action={updateAssetAction} className="space-y-8">
                    <input type="hidden" name="id" value={asset.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Asset Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={asset.name}
                          placeholder="e.g., Downtown Office Building"
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="asset_type"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Asset Type *
                        </Label>
                        <Select
                          name="asset_type"
                          defaultValue={asset.asset_type}
                          required
                        >
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Commercial Real Estate">
                              Commercial Real Estate
                            </SelectItem>
                            <SelectItem value="Residential Real Estate">
                              Residential Real Estate
                            </SelectItem>
                            <SelectItem value="Industrial Real Estate">
                              Industrial Real Estate
                            </SelectItem>
                            <SelectItem value="Commodity">Commodity</SelectItem>
                            <SelectItem value="Vehicle">Vehicle</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Art & Collectibles">
                              Art & Collectibles
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={asset.description}
                        placeholder="Provide a detailed description of your asset..."
                        required
                        rows={4}
                        className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="location"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <MapPin className="h-4 w-4" />
                          Location *
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={asset.location}
                          placeholder="e.g., New York, NY"
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="current_value"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <DollarSign className="h-4 w-4" />
                          Current Value (USD) *
                        </Label>
                        <Input
                          id="current_value"
                          name="current_value"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={asset.current_value}
                          placeholder="1000000"
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="blockchain"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Globe className="h-4 w-4" />
                        Blockchain Network *
                      </Label>
                      <Select
                        name="blockchain"
                        defaultValue={asset.blockchain}
                        required
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="arbitrum">Arbitrum</SelectItem>
                          <SelectItem value="optimism">Optimism</SelectItem>
                          <SelectItem value="bsc">BNB Smart Chain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex gap-4">
                      <SubmitButton
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        pendingText="Saving Changes..."
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </SubmitButton>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 px-8"
                        asChild
                      >
                        <Link href={`/dashboard/assets/${asset.id}`}>
                          Cancel
                        </Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Status */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg">Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Verification
                    </p>
                    <span
                      className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border ${
                        asset.verification_status === "verified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : asset.verification_status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {asset.verification_status.charAt(0).toUpperCase() +
                        asset.verification_status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Collateralization
                    </p>
                    <span
                      className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border ${
                        asset.collateralization_status === "collateralized"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {asset.collateralization_status.charAt(0).toUpperCase() +
                        asset.collateralization_status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Original Value
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      ${asset.original_value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card className="border border-yellow-200 shadow-lg bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
                <CardHeader className="border-b border-yellow-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Changes may require re-verification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>
                        Collateralized assets have limited editability
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Value changes affect lending capacity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-gray-900">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Contact our support team if you need assistance with asset
                    updates.
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
