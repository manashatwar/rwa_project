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
  Building,
  Package,
  Settings,
  Upload,
  Eye,
  Sparkles,
  Shield,
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

        {/* Blockchain Network Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-20 animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-100 rounded-full opacity-20 animate-pulse delay-2000" />
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-orange-100 rounded-full opacity-20 animate-pulse delay-3000" />
        </div>

        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-8 border border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Blockchain-Powered RWA Tokenization Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              Transform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Real Assets
              </span>
              <br />
              Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                NFT Collateral
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload documentation for your real estate, commodities, and
              equipment. Our verification team tokenizes them on the blockchain
              as NFTs, unlocking instant stablecoin liquidity through automated
              lending protocols.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {user ? "Go to Dashboard" : "Start Tokenizing Assets"}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Eye className="mr-3 w-5 h-5" />
                View Platform Demo
              </Link>
            </div>

            {/* Enhanced Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-blue-900">
                  Asset NFTs
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Convert real assets into blockchain NFTs
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-900">
                  USDC Lending
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Borrow stablecoins using NFT collateral
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-emerald-900">
                  Auto EMI
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Automated repayment schedules
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-orange-900">
                  Multi-Chain
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Ethereum, Polygon, BSC support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Supported Asset Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We tokenize a wide range of real-world assets into blockchain NFTs
              with full verification and documentation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Real Estate */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-blue-900">
                Real Estate
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Residential properties, commercial buildings, land parcels, and
                development projects
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Property Deeds & Titles
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Valuation Reports
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Insurance Documentation
                  </span>
                </div>
              </div>
            </div>

            {/* Commodities */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-emerald-900">
                Commodities
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Precious metals, oil reserves, agricultural products, and stored
                commodities
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">
                    Warehouse Receipts
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">
                    Quality Certificates
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">
                    Purity Verification
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-purple-900">
                Equipment
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Industrial machinery, vehicles, medical equipment, and
                specialized tools
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800">
                    Purchase Invoices
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800">
                    Maintenance Records
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800">
                    Condition Reports
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              RWA to NFT Lending Pipeline
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process transforms your physical assets into
              blockchain NFTs that can be used as collateral for instant
              stablecoin loans
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="relative text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-2xl mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                Upload Documentation
              </h3>
              <p className="text-gray-600 mb-6">
                Submit comprehensive documentation for your real-world assets
                including deeds, certificates, and valuations
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Secure Upload Portal
                  </span>
                </div>
              </div>
            </div>

            <div className="relative text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold text-2xl mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-emerald-900">
                Expert Verification
              </h3>
              <p className="text-gray-600 mb-6">
                Our verification team validates authenticity, legal ownership,
                and current market value of your assets
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">
                    Professional Review
                  </span>
                </div>
              </div>
            </div>

            <div className="relative text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl font-bold text-2xl mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-900">
                NFT Minting
              </h3>
              <p className="text-gray-600 mb-6">
                Verified assets are tokenized as NFTs on your preferred
                blockchain with immutable ownership records
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Blockchain Minting
                  </span>
                </div>
              </div>
            </div>

            <div className="relative text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-2xl mb-6 mx-auto shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4 text-orange-900">
                Instant Lending
              </h3>
              <p className="text-gray-600 mb-6">
                Use your NFT as collateral to borrow USDC instantly with
                automated EMI repayment options
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    USDC Loans
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Visualization */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">
                Complete Workflow Timeline
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Upload</p>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 mx-2"></div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Verify</p>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 to-purple-500 mx-2"></div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Mint NFT</p>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-orange-500 mx-2"></div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Lend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Networks Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Multi-Chain Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deploy your asset NFTs and access liquidity across multiple
              blockchain networks with seamless interoperability
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Ethereum */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white font-bold text-xl">Ξ</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ethereum
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Most liquid DeFi ecosystem
              </p>
              <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-blue-800">Active</span>
              </div>
            </div>

            {/* Polygon */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white font-bold text-xl">⬟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Polygon
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Low-cost, fast transactions
              </p>
              <div className="flex items-center justify-center gap-2 p-2 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-purple-800">Active</span>
              </div>
            </div>

            {/* BSC */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white font-bold text-xl">◉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">BSC</h3>
              <p className="text-sm text-gray-600 mb-3">
                High throughput network
              </p>
              <div className="flex items-center justify-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-yellow-800">Active</span>
              </div>
            </div>

            {/* Arbitrum */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white font-bold text-xl">△</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Arbitrum
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Layer 2 scaling solution
              </p>
              <div className="flex items-center justify-center gap-2 p-2 bg-emerald-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-emerald-800">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Cross-Chain Benefits */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-center text-xl font-semibold text-gray-900 mb-8">
                Cross-Chain Advantages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Liquidity Access
                  </h4>
                  <p className="text-sm text-gray-600">
                    Access lending pools across all supported networks
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Optimal Rates
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automatically find the best lending rates across chains
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Risk Distribution
                  </h4>
                  <p className="text-sm text-gray-600">
                    Spread risk across multiple blockchain ecosystems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Platform Performance</h2>
            <p className="text-xl text-blue-100">
              Trusted by asset owners worldwide for blockchain tokenization
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                $2.5B+
              </div>
              <div className="text-blue-100 text-lg">Assets Tokenized</div>
              <div className="text-blue-200 text-sm mt-1">
                Real estate, commodities, equipment
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                25K+
              </div>
              <div className="text-blue-100 text-lg">NFTs Minted</div>
              <div className="text-blue-200 text-sm mt-1">
                Verified asset tokens
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                $850M+
              </div>
              <div className="text-blue-100 text-lg">USDC Loans Issued</div>
              <div className="text-blue-200 text-sm mt-1">
                Stablecoin liquidity provided
              </div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform">
                99.8%
              </div>
              <div className="text-blue-100 text-lg">Success Rate</div>
              <div className="text-blue-200 text-sm mt-1">
                Successful asset verifications
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-center text-xl font-semibold mb-8">
                Live Network Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">47</div>
                  <div className="text-blue-100 text-sm">
                    Assets in Verification
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">$12.3M</div>
                  <div className="text-blue-100 text-sm">24h Loan Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">1,847</div>
                  <div className="text-blue-100 text-sm">
                    Active EMI Schedules
                  </div>
                </div>
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
              Transform Your Assets Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Digital Capital
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of asset owners leveraging blockchain technology to
              unlock liquidity, optimize portfolio performance, and access
              global DeFi markets through verified NFT tokenization.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="group inline-flex items-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
              >
                {user ? "Access Dashboard" : "Start Tokenizing Now"}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center px-10 py-5 text-xl font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="mr-3 w-6 h-6" />
                Explore Platform
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                No hidden fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Expert verification team
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                24/7 blockchain monitoring
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Instant USDC liquidity
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
