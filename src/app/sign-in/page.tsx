"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Wallet,
  ArrowRight,
  LogIn,
  Divider,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MetaMaskConnect from "@/components/metamask-connect";

export default function SignInPage() {
  const [authMethod, setAuthMethod] = useState<"email" | "wallet">("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid")) {
          setError("Invalid email or password. Please check your credentials.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        // Update last login in users table
        await supabase
          .from("users")
          .update({
            last_login: new Date().toISOString(),
            login_count: supabase.raw("login_count + 1"),
          })
          .eq("id", data.user.id);

        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSignIn = () => {
    toast.success("Wallet authentication successful!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
              <span className="text-xl font-extrabold text-white">Tf</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">TangibleFi</h1>
              <p className="text-sm text-blue-200">Real World Assets</p>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
            <p className="text-xl text-blue-200">
              Sign in to access your tokenized asset portfolio
            </p>
          </div>
        </div>

        {/* Authentication Method Selector */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center">
              Choose Sign In Method
            </CardTitle>
            <CardDescription className="text-blue-200 text-center">
              Access your account with email or wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Method Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setAuthMethod("email")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  authMethod === "email"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Mail className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-white text-sm font-medium">Email</div>
                <div className="text-blue-200 text-xs">Traditional login</div>
              </button>
              <button
                onClick={() => setAuthMethod("wallet")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  authMethod === "wallet"
                    ? "border-orange-400 bg-orange-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Wallet className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                <div className="text-white text-sm font-medium">Wallet</div>
                <div className="text-blue-200 text-xs">MetaMask connect</div>
              </button>
            </div>

            {/* Email Authentication Form */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/20 border-red-400/30">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-100">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In with Email
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Wallet Authentication */}
            {authMethod === "wallet" && (
              <div className="space-y-6">
                <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-4">
                  <h4 className="text-orange-100 font-medium mb-2">
                    Wallet Sign In
                  </h4>
                  <p className="text-sm text-orange-200">
                    Connect with the same wallet address you used during
                    registration.
                  </p>
                </div>

                <MetaMaskConnect
                  variant="button"
                  onSuccess={handleWalletSignIn}
                  onError={(error) => toast.error(error)}
                />

                <div className="text-center">
                  <p className="text-sm text-blue-200">
                    New to wallet authentication?{" "}
                    <button
                      onClick={() => setAuthMethod("email")}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Use email instead
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-blue-200">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="text-center space-y-4">
          <h3 className="text-white font-semibold">Secure Access To:</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400 text-lg">📊</span>
              </div>
              <div className="text-white text-xs font-medium">Portfolio</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-green-400 text-lg">💰</span>
              </div>
              <div className="text-white text-xs font-medium">Loans</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-400 text-lg">🔗</span>
              </div>
              <div className="text-white text-xs font-medium">DeFi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
