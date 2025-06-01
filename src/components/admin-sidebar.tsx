"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  LogOut,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
  Database,
  Lock,
  Users,
} from "lucide-react";

interface AdminSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  walletAddress?: string;
  isAuthenticated?: boolean;
}

export default function AdminSidebar({
  currentSection,
  onSectionChange,
  walletAddress,
  isAuthenticated,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminSections = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
      description: "Analytics & Overview",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badge: "Live",
      badgeColor: "bg-blue-100 text-blue-700",
      hoverBadgeColor: "hover:bg-blue-200 hover:text-blue-800",
    },
    {
      id: "asset-approval",
      title: "Asset Approval",
      icon: FileCheck,
      description: "Review RWA requests",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      badge: "3 Pending",
      badgeColor: "bg-emerald-100 text-emerald-700",
      hoverBadgeColor: "hover:bg-emerald-200 hover:text-emerald-800",
    },
    {
      id: "emergency-control",
      title: "Emergency Control",
      icon: AlertTriangle,
      description: "System shutdown & security",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badge: "Active",
      badgeColor: "bg-green-100 text-green-700",
      hoverBadgeColor: "hover:bg-green-200 hover:text-green-800",
    },
    {
      id: "contract-settings",
      title: "Smart Contracts",
      icon: Settings,
      description: "Contract configuration",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      badge: "12 Active",
      badgeColor: "bg-purple-100 text-purple-700",
      hoverBadgeColor: "hover:bg-purple-200 hover:text-purple-800",
    },
    {
      id: "fee-management",
      title: "Fee Management",
      icon: DollarSign,
      description: "Vault manager fees",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badge: "Updated",
      badgeColor: "bg-green-100 text-green-700",
      hoverBadgeColor: "hover:bg-green-200 hover:text-green-800",
    },
    {
      id: "automation",
      title: "Automation",
      icon: Zap,
      description: "Triggers & notifications",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badge: "5 Rules",
      badgeColor: "bg-yellow-100 text-yellow-700",
      hoverBadgeColor: "hover:bg-yellow-200 hover:text-yellow-800",
    },
    {
      id: "user-management",
      title: "User Management",
      icon: Users,
      description: "User accounts & permissions",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      badge: "2,384",
      badgeColor: "bg-indigo-100 text-indigo-700",
      hoverBadgeColor: "hover:bg-indigo-200 hover:text-indigo-800",
    },
  ];

  const quickStats = [
    {
      title: "Total Value",
      value: "$2.97B",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
    },
    {
      title: "Active Vaults",
      value: "89",
      icon: Lock,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
    },
    {
      title: "Pending",
      value: "3",
      icon: Activity,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      hoverBgColor: "hover:bg-yellow-100",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-80"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <span className="text-lg font-bold text-white">Tf</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TangibleFi
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Admin Panel</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Admin Status */}
      {!isCollapsed && isAuthenticated && walletAddress && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Admin Access</p>
              <p className="text-xs text-gray-500 font-mono truncate">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0 text-xs hover:bg-green-200 hover:text-green-800 transition-colors duration-200 cursor-default">
              Active
            </Badge>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${stat.hoverBgColor} group`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center group-hover:shadow-sm transition-shadow duration-200`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3
          className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isCollapsed ? "hidden" : ""}`}
        >
          Administration
        </h3>
        <div className="space-y-2">
          {adminSections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              onClick={() => handleSectionClick(section.id)}
              className={`
                w-full justify-start gap-3 p-4 h-auto transition-all duration-300 group
                ${
                  currentSection === section.id
                    ? `${section.bgColor} ${section.color} ${section.borderColor} border-l-4 shadow-sm hover:shadow-md`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-4 border-transparent hover:border-gray-200"
                }
                ${isCollapsed ? "px-3" : ""}
                hover:scale-[1.02] hover:shadow-sm
              `}
              title={isCollapsed ? section.title : undefined}
            >
              <section.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm group-hover:font-semibold transition-all duration-200">
                      {section.title}
                    </span>
                    {section.badge && (
                      <Badge
                        className={`text-xs ${section.badgeColor} ${section.hoverBadgeColor} border-0 ml-2 transition-all duration-200 transform group-hover:scale-105`}
                      >
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-200">
                    {section.description}
                  </p>
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 group"
          >
            <Link href="/">
              <Home className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && (
                <span className="text-sm group-hover:font-medium transition-all duration-200">
                  Return to Main Site
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            {!isCollapsed && (
              <span className="text-sm group-hover:font-medium transition-all duration-200">
                Disconnect
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
