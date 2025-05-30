import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Coins,
  FileCheck,
  Globe,
  Landmark,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Users,
  Zap,
  Lock,
  Target,
  DollarSign,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Multi-Chain RWA Lending Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              Tokenize{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Real Assets
              </span>
              <br />
              Access{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Global Liquidity
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your real-world assets into digital tokens and unlock
              instant liquidity. Manage loans, process payments, and track your
              portfolio across multiple blockchains with our comprehensive DeFi
              lending platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {user ? "Go to Dashboard" : "Start Tokenizing"}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <BarChart3 className="mr-3 w-5 h-5" />
                View Live Demo
              </Link>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Instant Liquidity
                </h3>
                <p className="text-gray-600 text-center">
                  Convert illiquid real-world assets into tradeable digital
                  tokens
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Multi-Chain Support
                </h3>
                <p className="text-gray-600 text-center">
                  Access liquidity across Ethereum, Polygon, and other networks
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Bank-Grade Security
                </h3>
                <p className="text-gray-600 text-center">
                  Enterprise security with full regulatory compliance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">How RWA Lending Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform bridges traditional finance with DeFi, allowing you
              to leverage real-world assets for instant crypto liquidity
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl font-bold text-xl mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Tokenize Your Assets
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Upload documentation for your real-world assets (real estate,
                commodities, equipment) and our verification team tokenizes them
                on the blockchain.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">
                    Asset Verification
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-2xl font-bold text-xl mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Access Instant Loans
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Use your tokenized assets as collateral to access instant crypto
                loans. Our smart contracts automatically manage loan terms and
                collateral ratios.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <Landmark className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium">Smart Contracts</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-2xl font-bold text-xl mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Manage & Repay
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Track your portfolio health, make payments in multiple
                cryptocurrencies, and monitor your positions across different
                blockchain networks.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <Coins className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium">
                    Multi-Token Payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Comprehensive Dashboard Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to manage your tokenized assets and lending
              activities in one place
            </p>

            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="mr-3 w-5 h-5" />
              {user ? "Access Your Dashboard" : "Try Dashboard Now"}
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Portfolio Overview",
                description:
                  "Real-time portfolio health monitoring with collateral ratios, loan balances, and risk assessment",
                color: "blue",
              },
              {
                icon: <FileCheck className="w-8 h-8" />,
                title: "Asset Management",
                description:
                  "Track verification status, manage tokenized assets, and monitor collateralization across chains",
                color: "green",
              },
              {
                icon: <Landmark className="w-8 h-8" />,
                title: "Loan Dashboard",
                description:
                  "Manage active loans, payment schedules, interest rates, and automated EMI tracking",
                color: "purple",
              },
              {
                icon: <Coins className="w-8 h-8" />,
                title: "Multi-Token Payments",
                description:
                  "Process loan payments in USDC, USDT, ETH, MATIC and other cryptocurrencies",
                color: "orange",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Cross-Chain Activity",
                description:
                  "Unified view of positions across Ethereum, Polygon, Arbitrum, and Optimism networks",
                color: "indigo",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Risk Management",
                description:
                  "Health ratio alerts, liquidation warnings, and portfolio optimization suggestions",
                color: "red",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Secure Vaults",
                description:
                  "Multi-signature wallets and hardware security modules for enterprise-grade protection",
                color: "gray",
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Real-Time Valuation",
                description:
                  "Live asset pricing, market data feeds, and automated portfolio rebalancing",
                color: "emerald",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div
                  className={`text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-blue-100">
              Join the future of asset-backed lending
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                $500M+
              </div>
              <div className="text-blue-100 text-lg">Assets Tokenized</div>
              <div className="text-blue-200 text-sm mt-1">
                Real estate, commodities, equipment
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                5+
              </div>
              <div className="text-blue-100 text-lg">Blockchain Networks</div>
              <div className="text-blue-200 text-sm mt-1">
                Ethereum, Polygon, Arbitrum, Optimism
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                10K+
              </div>
              <div className="text-blue-100 text-lg">Active Loans</div>
              <div className="text-blue-200 text-sm mt-1">
                $50M+ in outstanding loans
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <div className="text-blue-100 text-lg">Platform Uptime</div>
              <div className="text-blue-200 text-sm mt-1">
                Enterprise-grade reliability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Unlock Your Asset's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Potential?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of asset owners who are already leveraging
              blockchain technology to access instant liquidity and optimize
              their portfolio performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="group inline-flex items-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center px-10 py-5 text-xl font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="mr-3 w-6 h-6" />
                Explore Dashboard
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                24/7 support
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Bank-grade security
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Instant liquidity
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
