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
import {
  ArrowLeft,
  Wallet,
  Plus,
  CheckCircle,
  AlertTriangle,
  Shield,
  Zap,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import MetaMaskConnect from "@/components/metamask-connect";

const supportedWallets = [
  {
    name: "WalletConnect",
    description: "Scan with WalletConnect to connect",
    icon: "🔗",
    chains: ["Ethereum", "Polygon", "BSC", "Arbitrum", "Optimism"],
    status: "mobile",
  },
  {
    name: "Coinbase Wallet",
    description: "Connect with Coinbase Wallet",
    icon: "🔵",
    chains: ["Ethereum", "Polygon", "BSC"],
    status: "secure",
  },
  {
    name: "Trust Wallet",
    description: "Connect using Trust Wallet mobile app",
    icon: "🛡️",
    chains: ["Ethereum", "Polygon", "BSC"],
    status: "mobile",
  },
];

const supportedNetworks = [
  {
    name: "Ethereum",
    description: "The leading smart contract platform",
    icon: "⟠",
    color: "blue",
    gasToken: "ETH",
    status: "live",
  },
  {
    name: "Polygon",
    description: "Fast and low-cost Ethereum scaling",
    icon: "🔷",
    color: "purple",
    gasToken: "MATIC",
    status: "live",
  },
  {
    name: "Arbitrum",
    description: "Ethereum Layer 2 scaling solution",
    icon: "🔹",
    color: "cyan",
    gasToken: "ETH",
    status: "live",
  },
  {
    name: "Optimism",
    description: "Optimistic rollup for Ethereum",
    icon: "🔴",
    color: "red",
    gasToken: "ETH",
    status: "live",
  },
  {
    name: "BNB Smart Chain",
    description: "Binance's high-performance blockchain",
    icon: "🟡",
    color: "yellow",
    gasToken: "BNB",
    status: "live",
  },
];

async function connectWalletAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const walletType = formData.get("wallet_type") as string;

  // Mock wallet connection - in reality, this would handle wallet integration
  console.log("Connecting wallet:", walletType);

  // Simulate adding sample cross-chain positions
  const samplePositions = [
    {
      user_id: user.id,
      blockchain: "ethereum",
      asset_address: "0xA0b86a33E6B5e8C5FaE44e1A9B7c7C9F8A1e4B5B",
      asset_symbol: "USDC",
      balance: 15000.0,
      usd_value: 15000.0,
      position_type: "stablecoin",
    },
    {
      user_id: user.id,
      blockchain: "polygon",
      asset_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      asset_symbol: "USDC",
      balance: 8500.0,
      usd_value: 8500.0,
      position_type: "stablecoin",
    },
  ];

  for (const position of samplePositions) {
    await supabase.from("cross_chain_positions").upsert(position);
  }

  return redirect("/dashboard/cross-chain?connected=true");
}

export default async function ConnectWalletPage() {
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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                Connect Wallet
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Connect your wallet to access the decentralized ecosystem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Wallet Options */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wallet className="h-6 w-6 text-blue-600" />
                    Choose Wallet
                  </CardTitle>
                  <CardDescription className="text-base">
                    Select your preferred wallet to connect to the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MetaMask Component */}
                    <MetaMaskConnect />

                    {supportedWallets.map((wallet) => (
                      <form key={wallet.name} action={connectWalletAction}>
                        <input
                          type="hidden"
                          name="wallet_type"
                          value={wallet.name.toLowerCase()}
                        />
                        <button
                          type="submit"
                          className="w-full border border-gray-200 bg-white hover:bg-gray-50 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{wallet.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">
                                  {wallet.name}
                                </h3>
                                {wallet.status === "mobile" && (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                    Mobile
                                  </span>
                                )}
                                {wallet.status === "secure" && (
                                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                    Secure
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {wallet.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {wallet.chains.slice(0, 3).map((chain) => (
                                  <span
                                    key={chain}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                                  >
                                    {chain}
                                  </span>
                                ))}
                                {wallet.chains.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                                    +{wallet.chains.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      </form>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Supported Networks */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-6 w-6 text-emerald-600" />
                    Supported Networks
                  </CardTitle>
                  <CardDescription className="text-base">
                    Blockchain networks available for cross-chain management
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supportedNetworks.map((network) => (
                      <div
                        key={network.name}
                        className="border border-gray-200 bg-gray-50/30 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{network.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-base text-gray-900">
                                {network.name}
                              </h3>
                              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {network.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">
                                Gas:
                              </span>
                              <span className="font-medium text-blue-600">
                                {network.gasToken}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Features */}
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
                <CardHeader className="border-b border-emerald-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Non-custodial - you control your keys</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>End-to-end encryption for all data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Secure multi-signature support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Hardware wallet compatibility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <CardHeader className="border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>View all assets across multiple chains</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Send and receive assets seamlessly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Swap assets at optimal rates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Track portfolio performance</span>
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
                      <span>Ensure your wallet is unlocked</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Check network connection before proceeding</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Keep your seed phrase secure and private</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-gray-900">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Having trouble connecting your wallet? Our support team is
                    here to help.
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
