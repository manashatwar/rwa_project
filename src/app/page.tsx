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
  Cpu,
  Database,
  Network,
  Layers,
  Server,
  HardDrive,
  Monitor,
  Smartphone,
  Play,
  Star,
  Award,
  LineChart,
  PieChart,
  Activity,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"></div>

          {/* Additional 3D Geometric Shapes */}
          <div className="absolute top-40 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 transform rotate-45 rounded-3xl blur-lg animate-pulse"></div>
          <div
            className="absolute bottom-40 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/30 to-red-500/30 transform -rotate-12 rounded-2xl blur-lg animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 transform rotate-12 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Floating 3D Coins */}
          <div
            className="absolute top-32 left-1/3 w-16 h-16 transform animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "3s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-2xl border-4 border-yellow-300/50 flex items-center justify-center">
              <span className="text-yellow-100 font-bold text-xl">₿</span>
            </div>
          </div>

          <div
            className="absolute top-60 right-1/4 w-12 h-12 transform animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "4s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-2xl border-4 border-purple-300/50 flex items-center justify-center">
              <span className="text-purple-100 font-bold text-lg">Ξ</span>
            </div>
          </div>

          <div
            className="absolute bottom-1/3 left-1/5 w-14 h-14 transform animate-bounce"
            style={{ animationDelay: "2.5s", animationDuration: "3.5s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl border-4 border-blue-300/50 flex items-center justify-center">
              <span className="text-blue-100 font-bold text-lg">◉</span>
            </div>
          </div>

          <div
            className="absolute top-2/3 right-1/5 w-10 h-10 transform animate-bounce"
            style={{ animationDelay: "3s", animationDuration: "2.5s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-2xl border-4 border-emerald-300/50 flex items-center justify-center">
              <span className="text-emerald-100 font-bold text-sm">⬟</span>
            </div>
          </div>

          <div
            className="absolute bottom-20 right-1/2 w-8 h-8 transform animate-bounce"
            style={{ animationDelay: "4s", animationDuration: "4.5s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-2xl border-4 border-pink-300/50 flex items-center justify-center">
              <span className="text-pink-100 font-bold text-xs">$</span>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-40 left-10 w-4 h-4 bg-blue-400/60 rounded-full animate-ping"></div>
          <div
            className="absolute top-80 right-20 w-3 h-3 bg-purple-400/60 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-60 left-1/3 w-5 h-5 bg-emerald-400/60 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-32 right-10 w-2 h-2 bg-yellow-400/60 rounded-full animate-ping"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

          {/* 3D Floating Cubes */}
          <div
            className="absolute top-1/4 left-1/6 w-8 h-8 transform rotate-45 animate-spin"
            style={{ animationDuration: "8s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-cyan-300/30 rounded-lg shadow-xl"></div>
          </div>

          <div
            className="absolute bottom-1/4 right-1/6 w-6 h-6 transform -rotate-45 animate-spin"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-violet-400/40 to-purple-500/40 border border-violet-300/30 rounded-lg shadow-xl"></div>
          </div>

          <div
            className="absolute top-3/4 left-1/2 w-10 h-10 transform rotate-12 animate-spin"
            style={{ animationDuration: "10s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-rose-400/40 to-pink-500/40 border border-rose-300/30 rounded-lg shadow-xl"></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-blue-200 rounded-full text-sm font-medium mb-8 border border-white/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Be early to the future of asset finance
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Transform real assets into
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    digital tokens
                  </span>
                </h1>

                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Tokenize real estate, commodities, and equipment on a platform
                  trusted by thousands. Access instant USDC liquidity through
                  advanced DeFi protocols.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href={user ? "/dashboard" : "/sign-up"}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 text-lg"
                  >
                    {user ? "Launch Dashboard" : "Get Started"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-lg"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 text-blue-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">
                      Bank-grade security
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">
                      Licensed & regulated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">25K+ users</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Asset Price Cards */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Real Estate</h3>
                        <p className="text-blue-200 text-sm">REA</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      $2,547.89
                    </div>
                    <div className="text-green-400 text-sm font-medium">
                      +2.34%
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Tokenize
                      </button>
                      <button className="flex-1 bg-white/10 text-white text-sm font-medium py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Trade
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Gold</h3>
                        <p className="text-blue-200 text-sm">GOLD</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      $1,987.23
                    </div>
                    <div className="text-red-400 text-sm font-medium">
                      -0.58%
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Tokenize
                      </button>
                      <button className="flex-1 bg-white/10 text-white text-sm font-medium py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Trade
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Equipment</h3>
                        <p className="text-blue-200 text-sm">EQP</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      $845.67
                    </div>
                    <div className="text-green-400 text-sm font-medium">
                      +1.92%
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Tokenize
                      </button>
                      <button className="flex-1 bg-white/10 text-white text-sm font-medium py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Trade
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">USDC</h3>
                        <p className="text-blue-200 text-sm">Stablecoin</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      $1.00
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      0.00%
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Borrow
                      </button>
                      <button className="flex-1 bg-white/10 text-white text-sm font-medium py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Lend
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center text-blue-300 hover:text-blue-200 font-medium"
                  >
                    More Assets
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenization Platform Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Asset Tokenization
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  The only asset tokenization platform you'll ever need
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Upload and verify with ease
                      </h3>
                      <p className="text-gray-600">
                        Submit documentation for your real-world assets
                        including deeds, certificates, and valuations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Mint verified NFTs
                      </h3>
                      <p className="text-gray-600">
                        AI-powered verification system creates immutable
                        blockchain tokens of your assets.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Access instant liquidity
                      </h3>
                      <p className="text-gray-600">
                        Use your NFTs as collateral to borrow USDC with
                        automated EMI repayments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Connect to multi-chain DeFi
                      </h3>
                      <p className="text-gray-600">
                        Deploy across Ethereum, Polygon, BSC, and Arbitrum for
                        optimal rates and liquidity.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={user ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>

              {/* Right Content - Dashboard Preview */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Tf</span>
                      </div>
                      <span className="text-white font-medium">
                        TangibleFi Dashboard
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          $2.5M
                        </div>
                        <div className="text-blue-600 text-sm font-medium">
                          Assets Tokenized
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          $850K
                        </div>
                        <div className="text-green-600 text-sm font-medium">
                          USDC Borrowed
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Building className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Manhattan Apartment
                            </div>
                            <div className="text-gray-500 text-sm">
                              Real Estate • Verified
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            $750K
                          </div>
                          <div className="text-green-600 text-sm">
                            Available
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Coins className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Gold Reserves
                            </div>
                            <div className="text-gray-500 text-sm">
                              Commodity • Verified
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            $125K
                          </div>
                          <div className="text-blue-600 text-sm">Borrowed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Chain Trading Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content - Network Selection */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Multi-chain asset deployment
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            Ξ
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Ethereum
                          </div>
                          <div className="text-gray-500 text-sm">
                            Most liquid DeFi ecosystem
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">
                            ⬟
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Polygon
                          </div>
                          <div className="text-gray-500 text-sm">
                            Low-cost, fast transactions
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600 font-bold text-sm">
                            ◉
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            BNB Chain
                          </div>
                          <div className="text-gray-500 text-sm">
                            High throughput network
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-600 font-bold text-sm">
                            △
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Arbitrum
                          </div>
                          <div className="text-gray-500 text-sm">
                            Layer 2 scaling solution
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      Network Activity
                    </div>
                    <div className="text-blue-700 text-sm">
                      Cross-chain compatibility ensures optimal rates and
                      maximum liquidity access
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                  <Globe className="w-4 h-4 mr-2" />
                  Multi-Chain
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Lightning-fast asset trading
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">
                      Deploy across 4+ blockchain networks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">
                      AI-powered optimal rate discovery
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">
                      Cross-chain liquidity aggregation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">
                      24/7 live monitoring and support
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Start Trading
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
                  <Activity className="w-4 h-4 mr-2" />
                  Analytics
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  RWA data is in our DNA
                </h2>

                <div className="space-y-6 mb-8">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Explore the top tokenized assets, analyze the market, or
                    simply learn more about real-world asset tokenization.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Comprehensive asset data API
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Industry-leading analytics dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Real-time asset valuations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Market trend analysis
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Explore Analytics
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>

              {/* Right Content - Analytics Dashboard */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        RWA Analytics Dashboard
                      </span>
                    </div>
                    <div className="text-orange-400 text-sm font-medium">
                      Live Data
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          $2.5B
                        </div>
                        <div className="text-gray-500 text-sm">
                          Assets Tokenized
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          25.7K
                        </div>
                        <div className="text-gray-500 text-sm">NFTs Minted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          99.8%
                        </div>
                        <div className="text-gray-500 text-sm">
                          Success Rate
                        </div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="bg-gray-50 rounded-xl p-4 h-32 flex items-center justify-center mb-4">
                      <div className="flex items-end gap-2">
                        <div className="w-4 h-16 bg-blue-500 rounded-t"></div>
                        <div className="w-4 h-20 bg-blue-600 rounded-t"></div>
                        <div className="w-4 h-12 bg-blue-400 rounded-t"></div>
                        <div className="w-4 h-24 bg-blue-700 rounded-t"></div>
                        <div className="w-4 h-18 bg-blue-500 rounded-t"></div>
                        <div className="w-4 h-22 bg-blue-600 rounded-t"></div>
                        <div className="w-4 h-14 bg-blue-400 rounded-t"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Real Estate</span>
                        <span className="font-medium text-gray-900">68.4%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Commodities</span>
                        <span className="font-medium text-gray-900">23.1%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Equipment</span>
                        <span className="font-medium text-gray-900">8.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px]"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Let us take you from zero to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                tokenized assets
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of asset owners leveraging blockchain technology to
              unlock liquidity and access global DeFi markets through verified
              NFT tokenization.
            </p>

            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {user ? "Launch Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
