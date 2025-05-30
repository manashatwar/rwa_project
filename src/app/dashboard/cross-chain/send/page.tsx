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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Send,
  Wallet,
  Network,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";

async function sendAssetAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const assetId = formData.get("asset_id") as string;
  const recipientAddress = formData.get("recipient_address") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const network = formData.get("network") as string;

  // Mock transaction - in reality, this would interact with blockchain
  const transactionHash = "0x" + Math.random().toString(16).substring(2, 66);

  // Here you would implement actual blockchain transaction logic
  console.log("Sending transaction:", {
    assetId,
    recipientAddress,
    amount,
    network,
    transactionHash,
  });

  return redirect("/dashboard/cross-chain?sent=true");
}

export default async function SendPage({
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
  const selectedAssetId = params.asset as string;

  // Fetch user's positions for selection
  const { data: positions } = await supabase
    .from("cross_chain_positions")
    .select("*")
    .eq("user_id", user.id)
    .order("usd_value", { ascending: false });

  return (
    <>
      <DashboardNavbar />
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
                Send Assets
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Transfer your cross-chain assets to any address
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Send className="h-6 w-6 text-blue-600" />
                    Transfer Details
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure your asset transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form action={sendAssetAction} className="space-y-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="asset_id"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Wallet className="h-4 w-4" />
                        Select Asset *
                      </Label>
                      <Select
                        name="asset_id"
                        defaultValue={selectedAssetId}
                        required
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Choose asset to send" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions?.map((position) => (
                            <SelectItem key={position.id} value={position.id}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">
                                  {position.asset_symbol}
                                </span>
                                <span className="text-sm text-muted-foreground ml-4">
                                  {position.balance.toFixed(4)} available
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="recipient_address"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Recipient Address *
                      </Label>
                      <Input
                        id="recipient_address"
                        name="recipient_address"
                        placeholder="0x..."
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="amount"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <DollarSign className="h-4 w-4" />
                          Amount *
                        </Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.000001"
                          min="0"
                          placeholder="0.0"
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="network"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          <Network className="h-4 w-4" />
                          Network *
                        </Label>
                        <Select name="network" required>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select network" />
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
                    </div>

                    <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 space-y-3">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Transaction Summary
                      </h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Asset:</span>
                        <span className="font-medium">USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">100.00 USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Network Fee:
                        </span>
                        <span className="font-medium">~$2.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated Time:
                        </span>
                        <span className="font-medium">2-5 minutes</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex gap-4">
                      <SubmitButton
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        pendingText="Sending Transaction..."
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Transaction
                      </SubmitButton>
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
              {/* Security Tips */}
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
                <CardHeader className="border-b border-emerald-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Security Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Always double-check the recipient address</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Start with a small test transaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Verify the network matches the recipient</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Keep transaction hash for your records</span>
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
                      <span>Transactions are irreversible once confirmed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Network fees vary based on congestion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Cross-chain transfers may take longer</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-gray-900">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Our support team can help with cross-chain transfers and
                    troubleshooting.
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
