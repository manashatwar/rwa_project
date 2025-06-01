"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Settings,
  FileCheck,
  AlertTriangle,
  DollarSign,
  Zap,
  Users,
  BarChart3,
  Lock,
  Bell,
  Database,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Admin Section Components
import AdminDashboard from "@/components/admin/dashboard";
import AssetApprovalSection from "@/components/admin/asset-approval";
import EmergencyControlSection from "@/components/admin/emergency-control";
import ContractSettingsSection from "@/components/admin/contract-settings";
import FeeManagementSection from "@/components/admin/fee-management";
import AutomationSection from "@/components/admin/automation";
import UserManagementSection from "@/components/admin/user-management";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string>("dashboard"); // Default to dashboard
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Get admin wallet addresses from environment variables
  const getAdminWallets = (): string[] => {
    const adminWalletsEnv =
      process.env.ADMIN_WALLETS || process.env.NEXT_PUBLIC_ADMIN_WALLETS;
    if (!adminWalletsEnv) {
      console.warn("No admin wallets configured in environment variables");
      return [];
    }
    return adminWalletsEnv
      .split(",")
      .map((wallet) => wallet.trim().toLowerCase());
  };

  const ADMIN_WALLETS = getAdminWallets();

  useEffect(() => {
    checkAdminAuthentication();
  }, []);

  const checkAdminAuthentication = async () => {
    try {
      // Check if wallet is connected
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          const connectedWallet = accounts[0].toLowerCase();
          setWalletAddress(connectedWallet);

          // Check if connected wallet is an admin wallet
          const isAdmin = ADMIN_WALLETS.some(
            (adminWallet) => adminWallet.toLowerCase() === connectedWallet
          );

          if (isAdmin) {
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error("Error checking admin authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectAdminWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required for admin access");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const connectedWallet = accounts[0].toLowerCase();
        setWalletAddress(connectedWallet);

        // Check if connected wallet is an admin wallet
        const isAdmin = ADMIN_WALLETS.some(
          (adminWallet) => adminWallet.toLowerCase() === connectedWallet
        );

        if (isAdmin) {
          setIsAuthenticated(true);
        } else {
          alert("This wallet does not have admin privileges");
        }
      }
    } catch (error) {
      console.error("Error connecting admin wallet:", error);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "asset-approval":
        return (
          <AssetApprovalSection onBack={() => setCurrentSection("dashboard")} />
        );
      case "emergency-control":
        return (
          <EmergencyControlSection
            onBack={() => setCurrentSection("dashboard")}
          />
        );
      case "contract-settings":
        return (
          <ContractSettingsSection
            onBack={() => setCurrentSection("dashboard")}
          />
        );
      case "fee-management":
        return (
          <FeeManagementSection onBack={() => setCurrentSection("dashboard")} />
        );
      case "automation":
        return (
          <AutomationSection onBack={() => setCurrentSection("dashboard")} />
        );
      case "user-management":
        return (
          <UserManagementSection
            onBack={() => setCurrentSection("dashboard")}
          />
        );
      default:
        return <AdminDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Authenticating admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white border border-gray-200 shadow-xl max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Authentication Required
            </CardTitle>
            <CardDescription className="text-gray-600">
              {ADMIN_WALLETS.length === 0
                ? "No admin wallets configured. Please check your environment variables."
                : "Connect an authorized admin wallet to access the control panel"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ADMIN_WALLETS.length === 0 ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>Configuration Error:</strong> ADMIN_WALLETS or
                  NEXT_PUBLIC_ADMIN_WALLETS environment variable is not set.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {walletAddress && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      <strong>Connected:</strong> {walletAddress.slice(0, 6)}...
                      {walletAddress.slice(-4)}
                      <br />
                      This wallet is not authorized for admin access.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={connectAdminWallet}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Connect Admin Wallet
                </Button>
              </>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        walletAddress={walletAddress}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderCurrentSection()}</div>
    </div>
  );
}
