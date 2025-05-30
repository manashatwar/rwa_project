"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Building2,
  CreditCard,
  PieChart,
  Settings,
  FileText,
  TrendingUp,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Activity,
  DollarSign,
  BarChart3,
  Clock,
  UserCircle,
  BookOpen,
  Github,
  HelpCircle,
  Star,
  Zap,
  Target,
  Database,
  Globe,
  Layers,
  Network,
  Smartphone,
  RefreshCw,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  category?: string;
}

const sidebarItems: SidebarItem[] = [
  // Main Navigation
  {
    id: "dashboard",
    label: "My Dashboard",
    href: "/dashboard",
    icon: Home,
    category: "main",
  },
  {
    id: "assets",
    label: "My Assets",
    href: "/dashboard/assets",
    icon: Building2,
    badge: "New",
    badgeColor: "bg-blue-500",
    category: "main",
  },
  {
    id: "loans",
    label: "Borrow StableCoin",
    href: "/dashboard/loans",
    icon: CreditCard,
    badge: "4.25%",
    badgeColor: "bg-green-500",
    category: "main",
  },
  {
    id: "payments",
    label: "EMI Status",
    href: "/dashboard/payments",
    icon: DollarSign,
    category: "main",
  },
  {
    id: "cross-chain",
    label: "Cross-Chain Bridge",
    href: "/dashboard/cross-chain",
    icon: ArrowLeftRight,
    badge: "5 Chains",
    badgeColor: "bg-purple-500",
    category: "main",
  },

  // Portfolio & Analytics
  {
    id: "portfolio",
    label: "Portfolio Overview",
    href: "/dashboard/portfolio",
    icon: PieChart,
    category: "portfolio",
  },
  {
    id: "analytics",
    label: "Market Status",
    href: "/dashboard/market",
    icon: TrendingUp,
    badge: "Live",
    badgeColor: "bg-red-500",
    category: "portfolio",
  },
  {
    id: "transactions",
    label: "Transaction History",
    href: "/dashboard/transactions",
    icon: Activity,
    category: "portfolio",
  },
  {
    id: "performance",
    label: "Performance Metrics",
    href: "/dashboard/performance",
    icon: BarChart3,
    category: "portfolio",
  },

  // Account & Profile
  {
    id: "profile",
    label: "Profile Settings",
    href: "/dashboard/profile",
    icon: UserCircle,
    category: "account",
  },
  {
    id: "wallet",
    label: "Wallet Address",
    href: "/wallet-connect",
    icon: Wallet,
    badge: "Connect",
    badgeColor: "bg-orange-500",
    category: "account",
  },
  {
    id: "credit",
    label: "Credit Score",
    href: "/dashboard/credit",
    icon: Star,
    badge: "750",
    badgeColor: "bg-emerald-500",
    category: "account",
  },
  {
    id: "kyc",
    label: "KYC Verification",
    href: "/dashboard/kyc",
    icon: Shield,
    category: "account",
  },

  // Tools & Services
  {
    id: "tokenize",
    label: "Tokenize your RWA",
    href: "/dashboard/assets/new",
    icon: Zap,
    badge: "Hot",
    badgeColor: "bg-yellow-500",
    category: "tools",
  },
  {
    id: "calculator",
    label: "Loan Calculator",
    href: "/dashboard/calculator",
    icon: Target,
    category: "tools",
  },
  {
    id: "scheduler",
    label: "Payment Scheduler",
    href: "/dashboard/scheduler",
    icon: Clock,
    category: "tools",
  },
  {
    id: "api",
    label: "API Access",
    href: "/dashboard/api",
    icon: Database,
    badge: "Dev",
    badgeColor: "bg-indigo-500",
    category: "tools",
  },

  // Resources & Support
  {
    id: "documentation",
    label: "Documentation",
    href: "/docs",
    icon: BookOpen,
    category: "support",
  },
  {
    id: "community",
    label: "Community",
    href: "/community",
    icon: Users,
    category: "support",
  },
  {
    id: "support",
    label: "Help & Support",
    href: "/support",
    icon: HelpCircle,
    category: "support",
  },
  {
    id: "github",
    label: "Github",
    href: "https://github.com/tangiblefi",
    icon: Github,
    category: "support",
  },

  // Settings & Admin
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    category: "admin",
  },
  {
    id: "mobile",
    label: "Mobile App",
    href: "/mobile",
    icon: Smartphone,
    badge: "Soon",
    badgeColor: "bg-gray-500",
    category: "admin",
  },
];

const categoryLabels = {
  main: "Main",
  portfolio: "Portfolio",
  account: "Account",
  tools: "Tools",
  support: "Support",
  admin: "Settings",
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed: toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default function EnhancedSidebar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

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

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col fixed left-0 top-0 h-full z-40 shadow-lg`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b border-gray-200 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed ? (
          <>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="text-xl font-extrabold text-white">Tf</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TangibleFi</h1>
                <p className="text-xs text-gray-500">Real World Assets</p>
              </div>
            </Link>
            
            {/* Toggle Button - Only when expanded */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>
          </>
        ) : (
          /* Toggle Button replaces logo when collapsed */
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>

      {/* User Profile Section - Only when expanded */}
      {!isCollapsed && user && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">
                  {getUserInitials()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {getUserDisplayName()}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-emerald-600 font-medium">
                  Active
                </span>
              </div>
              {/* Wallet Address - if connected */}
              {user?.user_metadata?.wallet_address && (
                <div className="text-xs text-gray-500 font-mono">
                  {truncateAddress(user.user_metadata.wallet_address)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Score Widget - Only when expanded */}
      {!isCollapsed && <CreditScoreWidget />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-6">
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryItems = sidebarItems.filter(
              (item) => item.category === category
            );

            return (
              <div key={category}>
                {!isCollapsed && (
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {label}
                    </h3>
                  </div>
                )}

                <div className="space-y-1">
                  {categoryItems.map((item) => (
                    <SidebarItemComponent
                      key={item.id}
                      item={item}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        className={`border-t border-gray-200 p-4 ${isCollapsed ? "px-2" : "px-4"}`}
      >
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">TangibleFi v2.0</p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">
                All Systems Operational
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarItemComponent({
  item,
  isCollapsed,
}: {
  item: SidebarItem;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const isExternal = item.href.startsWith("http");

  const ItemIcon = item.icon;

  const content = (
    <>
      <div
        className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} w-full`}
      >
        <ItemIcon
          className={`h-5 w-5 ${
            isActive
              ? "text-blue-600"
              : "text-gray-600 group-hover:text-blue-600"
          } transition-colors`}
        />

        {!isCollapsed && (
          <>
            <span
              className={`ml-3 font-medium ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 group-hover:text-blue-600"
              } transition-colors`}
            >
              {item.label}
            </span>

            {item.badge && (
              <Badge
                className={`ml-auto text-xs ${item.badgeColor} text-white border-0`}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </div>
    </>
  );

  const className = `group flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
    isActive
      ? "bg-blue-50 border border-blue-200 text-blue-600 shadow-sm"
      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
  } ${isCollapsed ? "justify-center" : "justify-start"}`;

  if (isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={isCollapsed ? item.label : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      title={isCollapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
}

function CreditScoreWidget() {
  const [creditScore, setCreditScore] = useState(750);

  return (
    <div className="mx-4 my-3">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">
                Credit Score
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs">
              Excellent
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-700">
                {creditScore}
              </span>
              <span className="text-xs text-emerald-600">/850</span>
            </div>

            <div className="w-full bg-emerald-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(creditScore / 850) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-emerald-700">
              Qualify for premium rates
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
