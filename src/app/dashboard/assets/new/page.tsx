import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
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
  Upload,
  Info,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Globe,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";

async function createAssetAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const name = formData.get("name") as string;
  const assetType = formData.get("asset_type") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const originalValue = parseFloat(formData.get("original_value") as string);
  const blockchain = formData.get("blockchain") as string;

  const { error } = await supabase.from("assets").insert({
    user_id: user.id,
    name,
    asset_type: assetType,
    description,
    location,
    original_value: originalValue,
    current_value: originalValue,
    blockchain,
    verification_status: "pending",
    collateralization_status: "available",
  });

  if (error) {
    console.error("Error creating asset:", error);
    return;
  }

  return redirect("/dashboard/assets");
}

export default async function NewAssetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 animate-fadeIn">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Enhanced Header with Back Button */}
          <div className="mb-8 animate-slideDown">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link
                  href="/dashboard/assets"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Assets
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Estimated time: 5-10 minutes</span>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Tokenize New Asset
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your real-world assets into blockchain-based NFTs for
                lending and investment opportunities
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-slideUp">
            {/* Main Form - Takes 3 columns */}
            <div className="xl:col-span-3">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    Asset Information
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Provide comprehensive details about the asset you want to
                    tokenize on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form action={createAssetAction} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            1
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Basic Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            placeholder="e.g., Downtown Office Building"
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="asset_type"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Asset Type *
                          </Label>
                          <Select name="asset_type" required>
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
                              <SelectItem value="Commodity">
                                Commodity
                              </SelectItem>
                              <SelectItem value="Vehicle">Vehicle</SelectItem>
                              <SelectItem value="Equipment">
                                Equipment
                              </SelectItem>
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
                          placeholder="Provide a comprehensive description of your asset including its condition, features, and any relevant details..."
                          required
                          rows={4}
                          className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                        />
                      </div>
                    </div>

                    {/* Location & Valuation Section */}
                    <div className="space-y-6 border-t border-gray-200 pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600">
                            2
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Location & Valuation
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            placeholder="e.g., New York, NY, USA"
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="original_value"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <DollarSign className="h-4 w-4" />
                            Asset Value (USD) *
                          </Label>
                          <Input
                            id="original_value"
                            name="original_value"
                            type="number"
                            step="0.01"
                            min="10000"
                            placeholder="1000000"
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                          />
                          <p className="text-xs text-gray-500">
                            Minimum value: $10,000
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Selection Section */}
                    <div className="space-y-6 border-t border-gray-200 pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">
                            3
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Blockchain Network
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="blockchain"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <Globe className="h-4 w-4" />
                          Select Blockchain Network *
                        </Label>
                        <Select name="blockchain" required>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Choose your preferred blockchain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                Ethereum - Most secure, highest fees
                              </div>
                            </SelectItem>
                            <SelectItem value="polygon">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                Polygon - Fast & low cost
                              </div>
                            </SelectItem>
                            <SelectItem value="arbitrum">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                                Arbitrum - Ethereum Layer 2
                              </div>
                            </SelectItem>
                            <SelectItem value="optimism">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                Optimism - Scalable Ethereum
                              </div>
                            </SelectItem>
                            <SelectItem value="bsc">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                BNB Chain - Low fees, fast
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Choose based on your preference for speed, cost, and
                          security. You can always bridge to other networks
                          later.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-gray-200 pt-8">
                      <SubmitButton
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl"
                        pendingText="Creating Your Asset NFT..."
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Tokenize Asset & Create NFT
                      </SubmitButton>
                      <p className="text-center text-sm text-gray-500 mt-3">
                        By proceeding, you agree to our terms and understand
                        that your asset will undergo verification
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="xl:col-span-1 space-y-6">
              {/* Process Timeline */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                    Tokenization Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-blue-500 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-blue-600">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          Submit Details
                        </h4>
                        <p className="text-sm text-gray-600">
                          Provide asset information and documentation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-yellow-500 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-yellow-600">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          Expert Verification
                        </h4>
                        <p className="text-sm text-gray-600">
                          Our team verifies your asset details (1-3 business
                          days)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 border-2 border-emerald-500 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-emerald-600">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          NFT Minting
                        </h4>
                        <p className="text-sm text-gray-600">
                          Asset becomes an NFT ready for lending
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Checklist */}
              <Card className="border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      <span className="text-gray-700">
                        Asset must be owned by you
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      <span className="text-gray-700">
                        Minimum value of $10,000
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      <span className="text-gray-700">
                        Valid ownership documentation
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      <span className="text-gray-700">
                        Asset location verification
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-gray-900">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Our expert team is here to guide you through the
                    tokenization process and answer any questions.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
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
