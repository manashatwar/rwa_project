"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  BarChart3,
  FileCheck,
  Landmark,
  Coins,
  Globe,
  Wallet,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold text-blue-600 flex items-center"
          >
            <Wallet className="h-6 w-6 mr-2" />
            <span>RWA Lending</span>
          </Link>

          {/* Dashboard Navigation */}
          <div className="hidden md:flex ml-10 space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Overview
            </Link>
            <Link
              href="/dashboard/assets"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <FileCheck className="h-4 w-4 mr-1" />
              Assets
            </Link>
            <Link
              href="/dashboard/loans"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <Landmark className="h-4 w-4 mr-1" />
              Loans
            </Link>
            <Link
              href="/dashboard/payments"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <Coins className="h-4 w-4 mr-1" />
              Payments
            </Link>
            <Link
              href="/dashboard/cross-chain"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <Globe className="h-4 w-4 mr-1" />
              Cross-Chain
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            <Home className="h-5 w-5" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center w-full"
                >
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
