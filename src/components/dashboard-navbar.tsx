"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  BarChart3,
  FileCheck,
  Landmark,
  Coins,
  Globe,
  Wallet,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  Home,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: BarChart3,
    exact: true,
  },
  {
    name: "Assets",
    href: "/dashboard/assets",
    icon: FileCheck,
    badge: "2",
  },
  {
    name: "Loans",
    href: "/dashboard/loans",
    icon: Landmark,
    badge: "5",
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: Coins,
  },
  {
    name: "Cross-Chain",
    href: "/dashboard/cross-chain",
    icon: Globe,
  },
];

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  RWA Lending
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {/* Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/assets?action=add">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Tokenize Asset
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/loans?action=apply">
                    <Landmark className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/payments?action=pay">
                    <Coins className="w-4 h-4 mr-2" />
                    Make Payment
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <UserCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="hidden md:block text-sm">John</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-gray-500">
                      john@example.com
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors min-w-0 flex-shrink-0",
                  active ? "text-blue-600 bg-blue-50" : "text-gray-600"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-3 px-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
