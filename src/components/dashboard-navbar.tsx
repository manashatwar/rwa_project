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
import { Input } from "./ui/input";
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
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

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

interface Notification {
  id: string;
  type:
    | "payment_due"
    | "asset_verified"
    | "loan_approved"
    | "price_alert"
    | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Get user data
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch user's notifications
        await fetchNotifications(user.id);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchNotifications(session.user.id);
      } else {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotifications = async (userId: string) => {
    // Mock notifications - in a real app, these would come from your database
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "payment_due",
        title: "Payment Due Soon",
        message: "Your loan payment of $2,500 is due in 3 days",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        priority: "high",
      },
      {
        id: "2",
        type: "asset_verified",
        title: "Asset Verified",
        message: "Your Downtown Office Building has been successfully verified",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        priority: "medium",
      },
      {
        id: "3",
        type: "price_alert",
        title: "Price Alert",
        message: "ETH price has increased by 5% in your portfolio",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        read: true,
        priority: "low",
      },
      {
        id: "4",
        type: "loan_approved",
        title: "Loan Approved",
        message: "Your $400,000 loan application has been approved",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: false,
        priority: "high",
      },
      {
        id: "5",
        type: "system",
        title: "System Update",
        message: "New cross-chain features are now available",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
        priority: "low",
      },
    ];

    setNotifications(mockNotifications);
  };

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/dashboard?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchOpen(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "payment_due":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "asset_verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "loan_approved":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "price_alert":
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case "system":
        return <Activity className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityUnread = notifications.filter(
    (n) => !n.read && n.priority === "high"
  ).length;

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  RWA Lending
                </span>
                <div className="flex items-center gap-1 -mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Multi-Chain</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shadow-sm">
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
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
            {/* Enhanced Search */}
            <div className="relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search portfolio..."
                    className="pl-10 pr-4 w-48 lg:w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hidden lg:block"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  />
                </div>
              </form>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Search suggestions dropdown */}
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full mt-2 w-full lg:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Search suggestions
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href={`/dashboard/assets?search=${searchQuery}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <FileCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Search in Assets</span>
                    </Link>
                    <Link
                      href={`/dashboard/loans?search=${searchQuery}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Landmark className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Search in Loans</span>
                    </Link>
                    <Link
                      href={`/dashboard/cross-chain?search=${searchQuery}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Globe className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Search in Cross-Chain</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 shadow-lg border-0 bg-white/95 backdrop-blur-sm"
              >
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/assets/new"
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Mint Asset NFT
                      </p>
                      <p className="text-xs text-gray-500">
                        Convert real-world assets to NFTs
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/loans/new"
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Landmark className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Borrow Stablecoins
                      </p>
                      <p className="text-xs text-gray-500">
                        Use NFTs as collateral for USDC loans
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/payments"
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Coins className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Setup Auto-EMI
                      </p>
                      <p className="text-xs text-gray-500">
                        Automated stablecoin repayments
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/cross-chain/connect"
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Connect Wallet
                      </p>
                      <p className="text-xs text-gray-500">
                        Link blockchain accounts
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-50 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant={
                        highPriorityUnread > 0 ? "destructive" : "default"
                      }
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 shadow-lg border-0 bg-white/95 backdrop-blur-sm max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-700"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  <div className="py-2">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-2",
                          notification.read
                            ? "border-l-transparent"
                            : notification.priority === "high"
                              ? "border-l-red-500"
                              : notification.priority === "medium"
                                ? "border-l-yellow-500"
                                : "border-l-blue-500"
                        )}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  notification.read
                                    ? "text-gray-600"
                                    : "text-gray-900"
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-sm leading-relaxed",
                                notification.read
                                  ? "text-gray-500"
                                  : "text-gray-700"
                              )}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatNotificationTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {notifications.length > 5 && (
                      <div className="p-3 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-blue-600 hover:text-blue-700"
                        >
                          View all notifications
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      No notifications yet
                    </p>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  {/* <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {getUserInitials()}
                    </span>
                  </div> */}
                  <span className="hidden md:block text-sm font-medium">
                    {getUserDisplayName()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 shadow-lg border-0 bg-white/95 backdrop-blur-sm"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {getUserDisplayName()}
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 p-2"
                  >
                    <UserCircle className="w-4 h-4 text-gray-600" />
                    <span>Profile & Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/dashboard/security"
                    className="flex items-center gap-3 p-2"
                  >
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span>Security</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/help" className="flex items-center gap-3 p-2">
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/" className="flex items-center gap-3 p-2">
                    <Home className="w-4 h-4 text-gray-600" />
                    <span>Back to Home</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer flex items-center gap-3 p-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
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

      {/* Enhanced Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-between overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-shrink-0",
                  active
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
