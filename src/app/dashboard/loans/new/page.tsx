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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  DollarSign,
  Percent,
  Calendar,
  Landmark,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calculator,
  FileText,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { createLoanRequestAction } from "./actions";
import { redirect } from "next/navigation";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  current_value: number;
  verification_status: string;
  collateralization_status: string;
}

export default async function NewLoanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get verified assets that can be used as collateral
  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .eq("verification_status", "verified")
    .eq("collateralization_status", "available")
    .order("current_value", { ascending: false });

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="shadow-sm">
              <Link href="/dashboard/loans">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Loans
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Request Loan
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Use your verified assets as collateral to secure a loan
              </p>
            </div>
          </div>

          {!assets || assets.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <Shield className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-40" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  No Eligible Assets Found
                </h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  You need verified assets that are available for
                  collateralization to request a loan.
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Link href="/dashboard/assets/new">
                    <Building className="h-5 w-5 mr-2" />
                    Tokenize Your First Asset
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      Loan Details
                    </CardTitle>
                    <CardDescription className="text-base">
                      Configure your loan terms and select collateral
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form
                      action={createLoanRequestAction}
                      className="space-y-8"
                    >
                      <div className="space-y-3">
                        <Label
                          htmlFor="asset_id"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <Building className="h-4 w-4" />
                          Collateral Asset *
                        </Label>
                        <Select name="asset_id" required>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select an asset as collateral" />
                          </SelectTrigger>
                          <SelectContent>
                            {assets.map((asset: Asset) => (
                              <SelectItem key={asset.id} value={asset.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">
                                    {asset.name}
                                  </span>
                                  <span className="text-sm text-muted-foreground ml-4">
                                    ${asset.current_value.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="loan_amount"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <DollarSign className="h-4 w-4" />
                            Loan Amount (USD) *
                          </Label>
                          <Input
                            id="loan_amount"
                            name="loan_amount"
                            type="number"
                            step="0.01"
                            min="1000"
                            max="10000000"
                            placeholder="100000"
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="loan_term_months"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Calendar className="h-4 w-4" />
                            Loan Term (Months) *
                          </Label>
                          <Select name="loan_term_months" required>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12 months</SelectItem>
                              <SelectItem value="24">24 months</SelectItem>
                              <SelectItem value="36">36 months</SelectItem>
                              <SelectItem value="48">48 months</SelectItem>
                              <SelectItem value="60">60 months</SelectItem>
                              <SelectItem value="120">120 months</SelectItem>
                              <SelectItem value="240">240 months</SelectItem>
                              <SelectItem value="360">360 months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="interest_rate"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Percent className="h-4 w-4" />
                            Interest Rate (%) *
                          </Label>
                          <Select name="interest_rate" required>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue placeholder="Select rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3.5">
                                3.5% - Excellent Credit
                              </SelectItem>
                              <SelectItem value="4.5">
                                4.5% - Good Credit
                              </SelectItem>
                              <SelectItem value="5.25">
                                5.25% - Standard Rate
                              </SelectItem>
                              <SelectItem value="6.0">
                                6.0% - Fair Credit
                              </SelectItem>
                              <SelectItem value="7.5">
                                7.5% - Higher Risk
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="blockchain"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Blockchain Network *
                          </Label>
                          <Select name="blockchain" required>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="polygon">Polygon</SelectItem>
                              <SelectItem value="arbitrum">Arbitrum</SelectItem>
                              <SelectItem value="optimism">Optimism</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="purpose"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Loan Purpose *
                        </Label>
                        <Textarea
                          id="purpose"
                          name="purpose"
                          placeholder="Describe the intended use of the loan funds..."
                          required
                          rows={4}
                          className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-8 flex gap-4">
                        <SubmitButton
                          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          pendingText="Submitting Request..."
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Submit Loan Request
                        </SubmitButton>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 px-8"
                          asChild
                        >
                          <Link href="/dashboard/loans">Cancel</Link>
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Loan Calculator */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calculator className="h-5 w-5 text-emerald-600" />
                      Loan Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Estimated Monthly Payment
                      </p>
                      <p className="text-2xl font-bold text-gray-900">$2,500</p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Principal</span>
                        <span className="font-medium">$100,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Interest Rate
                        </span>
                        <span className="font-medium">5.25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Term</span>
                        <span className="font-medium">36 months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
                  <CardHeader className="border-b border-emerald-200">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span>Verified asset ownership</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span>Minimum $10,000 loan amount</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span>Asset not currently collateralized</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span>Valid loan purpose documentation</span>
                      </li>
                    </ul>
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
                        <span>Your asset will be locked as collateral</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Loan approval may take 1-3 business days</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          Missing payments may result in asset liquidation
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-3 text-gray-900">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Our lending specialists can help you choose the best loan
                      terms.
                    </p>
                    <Button variant="outline" size="lg" className="w-full">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
