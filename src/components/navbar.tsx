import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import {
  BarChart3,
  Wallet,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
} from "lucide-react";
import UserProfile from "./user-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>
            New: Multi-chain asset tokenization now live across 5+ networks!
          </span>
          <Link href="/dashboard" className="underline hover:no-underline">
            Explore →
          </Link>
        </div>
      </div>

      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    RWA Lending
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    Multi-Chain Platform
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Features
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Platform Features
                      </div>
                      <DropdownMenuItem asChild>
                        <Link
                          href="#asset-tokenization"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Asset Tokenization
                            </div>
                            <div className="text-sm text-gray-500">
                              Convert real assets to tokens
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="#lending"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">DeFi Lending</div>
                            <div className="text-sm text-gray-500">
                              Access instant liquidity
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="#cross-chain"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Cross-Chain Support
                            </div>
                            <div className="text-sm text-gray-500">
                              Multi-blockchain compatibility
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10"
                    >
                      <Users className="w-4 h-4" />
                      Solutions
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Use Cases
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="#real-estate" className="p-3 rounded-lg">
                          <div className="font-medium">Real Estate</div>
                          <div className="text-sm text-gray-500">
                            Property tokenization & lending
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#commodities" className="p-3 rounded-lg">
                          <div className="font-medium">Commodities</div>
                          <div className="text-sm text-gray-500">
                            Gold, silver, oil tokenization
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#equipment" className="p-3 rounded-lg">
                          <div className="font-medium">Equipment Finance</div>
                          <div className="text-sm text-gray-500">
                            Machinery & vehicle lending
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" className="h-10">
                  <Link
                    href="#documentation"
                    className="flex items-center gap-2"
                  >
                    Docs
                  </Link>
                </Button>

                <Button variant="ghost" className="h-10">
                  <Link href="#about" className="flex items-center gap-2">
                    About
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop only */}
              <div className="hidden md:flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-64 justify-start text-gray-500 border-gray-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search docs, features...
                </Button>
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      3
                    </Badge>
                  </Button>

                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <UserProfile />
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
