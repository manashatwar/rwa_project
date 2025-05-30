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
  Building2,
  Coins,
  Truck,
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
      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>
            New: Multi-chain asset tokenization now live across 5+ networks!
          </span>
          <Link href="/dashboard" className="underline hover:no-underline">
            Explore →
          </Link>
        </div>
      </div> */}

      <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    RWA Lending Platform
                  </span>
                  <div className="flex items-center gap-1 -mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Multi-Chain</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
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
                        <Link
                          href="#real-estate"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium">Real Estate</div>
                            <div className="text-sm text-gray-500">
                              Property tokenization & lending
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="#commodities"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Coins className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium">Commodities</div>
                            <div className="text-sm text-gray-500">
                              Gold, silver, oil tokenization
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="#equipment"
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium">Equipment Finance</div>
                            <div className="text-sm text-gray-500">
                              Machinery & vehicle lending
                            </div>
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

              {/* User Profile */}
              <UserProfile />

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
