"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Settings,
  DollarSign,
  Zap,
  BarChart3,
  Home,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface AdminNavbarProps {
  walletAddress?: string;
  isAuthenticated?: boolean;
  onSectionChange?: (section: string) => void;
  currentSection?: string;
}

export default function AdminNavbar({
  walletAddress,
  isAuthenticated,
  onSectionChange,
  currentSection,
}: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const adminSections = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      description: "Main admin overview",
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-50",
    },
    {
      id: "asset-approval",
      title: "Asset Approval",
      icon: FileCheck,
      description: "Review RWA tokenization requests",
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-50",
      badge: "3 Pending",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "emergency-control",
      title: "Emergency Control",
      icon: AlertTriangle,
      description: "System shutdown & security",
      color: "text-red-600",
      hoverColor: "hover:bg-red-50",
      badge: "Active",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      id: "contract-settings",
      title: "Contract Settings",
      icon: Settings,
      description: "Smart contract configuration",
      color: "text-purple-600",
      hoverColor: "hover:bg-purple-50",
      badge: "12 Contracts",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      id: "fee-management",
      title: "Fee Management",
      icon: DollarSign,
      description: "Vault manager fees control",
      color: "text-green-600",
      hoverColor: "hover:bg-green-50",
      badge: "Updated",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      id: "automation",
      title: "Automation",
      icon: Zap,
      description: "Triggers & notifications",
      color: "text-yellow-600",
      hoverColor: "hover:bg-yellow-50",
      badge: "5 Active",
      badgeColor: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      description: "Platform metrics & monitoring",
      color: "text-indigo-600",
      hoverColor: "hover:bg-indigo-50",
      badge: "Live",
      badgeColor: "bg-indigo-100 text-indigo-700",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Admin Control Panel</span>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              All Systems Operational
            </Badge>
          </div>

          {isAuthenticated && walletAddress && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                Authorized
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
                  <span className="text-lg font-bold text-white">Tf</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TangibleFi
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {adminSections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${
                      currentSection === section.id
                        ? `bg-gradient-to-r from-blue-50 to-purple-50 ${section.color} shadow-sm`
                        : `text-gray-600 ${section.hoverColor}`
                    }
                  `}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{section.title}</span>
                  {section.badge && (
                    <Badge
                      className={`ml-1 text-xs ${section.badgeColor} border-0`}
                    >
                      {section.badge}
                    </Badge>
                  )}
                  {currentSection === section.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">2</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      System Alerts
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">
                              High Risk Asset Detected
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                              Asset ASSET-002 requires immediate review
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <FileCheck className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              New Asset Submission
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Manhattan property worth $2.5M pending approval
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    {walletAddress && (
                      <p className="text-xs text-gray-500 font-mono">
                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                      </p>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Return to Main Site
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {adminSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-full justify-start gap-3 px-4 py-3 h-auto
                      ${
                        currentSection === section.id
                          ? `bg-gradient-to-r from-blue-50 to-purple-50 ${section.color}`
                          : `text-gray-600 ${section.hoverColor}`
                      }
                    `}
                  >
                    <section.icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">
                        {section.description}
                      </div>
                    </div>
                    {section.badge && (
                      <Badge
                        className={`text-xs ${section.badgeColor} border-0`}
                      >
                        {section.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
