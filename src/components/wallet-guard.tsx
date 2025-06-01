"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  checkWalletConnection,
  validateWalletForTransaction,
  enforceWalletConsistency,
} from "@/lib/wallet-validation";

interface WalletGuardProps {
  children: React.ReactNode;
  requiresTransaction?: boolean;
  redirectTo?: string;
  showConnectButton?: boolean;
}

export default function WalletGuard({
  children,
  requiresTransaction = false,
  redirectTo = "/wallet-connect",
  showConnectButton = true,
}: WalletGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkWalletStatus();
  }, []);

  const checkWalletStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check basic wallet connection
      const connectionInfo = await checkWalletConnection();
      setConnectionStatus(connectionInfo);

      if (!connectionInfo.isConnected) {
        setError("Please connect your MetaMask wallet to continue");
        return;
      }

      if (requiresTransaction) {
        // Additional validation for transaction pages
        const transactionValidation = await validateWalletForTransaction();
        if (!transactionValidation.isValid) {
          setError(transactionValidation.error || "Wallet validation failed");
          return;
        }

        // Ensure wallet consistency
        const consistencyCheck = await enforceWalletConsistency();
        if (!consistencyCheck.isConsistent) {
          setError(consistencyCheck.error || "Wallet mismatch detected");
          return;
        }
      }

      setIsValidated(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Wallet check failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    router.push(redirectTo);
  };

  const handleRefresh = () => {
    checkWalletStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Checking Wallet Connection
            </h3>
            <p className="text-blue-200 text-sm">
              Verifying your wallet status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidated || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
              {connectionStatus?.isConnected ? (
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              ) : (
                <Wallet className="w-8 h-8 text-orange-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {connectionStatus?.isConnected
                ? "Wallet Validation Required"
                : "Wallet Connection Required"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/20 border-red-400/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-100">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Connection Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm">MetaMask Status</span>
                <span
                  className={`text-sm ${
                    connectionStatus?.isConnected
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {connectionStatus?.isConnected
                    ? "✓ Connected"
                    : "❌ Not Connected"}
                </span>
              </div>

              {connectionStatus?.walletAddress && (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">Wallet Address</span>
                  <span className="text-blue-300 text-sm font-mono">
                    {connectionStatus.walletAddress.slice(0, 6)}...
                    {connectionStatus.walletAddress.slice(-4)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm">Validation Status</span>
                <span
                  className={`text-sm ${
                    connectionStatus?.isValidated
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {connectionStatus?.isValidated
                    ? "✓ Validated"
                    : "❌ Not Validated"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {showConnectButton && (
                <Button
                  onClick={handleConnectWallet}
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {connectionStatus?.isConnected
                    ? "Fix Wallet Connection"
                    : "Connect Wallet"}
                </Button>
              )}

              <Button
                onClick={handleRefresh}
                variant="outline"
                size="lg"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-100 font-medium text-sm mb-1">
                    Security Notice
                  </h4>
                  <p className="text-blue-200 text-xs leading-relaxed">
                    {requiresTransaction
                      ? "Transactions require wallet validation to ensure security. Please use the same wallet address that you registered with."
                      : "Connect your MetaMask wallet to access this feature. Your wallet address must match your registered account."}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Link */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:text-blue-200 hover:bg-white/5"
                onClick={() =>
                  window.open("https://metamask.io/download/", "_blank")
                }
              >
                Need MetaMask? Install Here
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wallet is connected and validated - render children
  return (
    <>
      {children}

      {/* Floating wallet status indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-100 text-xs font-medium">
            Wallet Verified
          </span>
        </div>
      </div>
    </>
  );
}
