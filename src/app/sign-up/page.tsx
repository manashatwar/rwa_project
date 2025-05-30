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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Wallet,
  ArrowRight,
  Shield,
  Building,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MetaMaskConnect from "@/components/metamask-connect";

export default function SignUpPage() {
  const [step, setStep] = useState(1); // 1: Email signup, 2: Wallet connection (optional)
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "personal",
  });

  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Sign up with email
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              account_type: formData.accountType,
              auth_method: "email",
            },
          },
        }
      );

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (authData.user) {
        // Create user profile in our users table
        const { error: insertError } = await supabase.from("users").upsert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          account_type: formData.accountType,
          auth_method: "email",
          account_status: "active",
          email_verified: false,
          wallet_connected: false,
          login_count: 1,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("User profile creation error:", insertError);
          // Don't throw here as the auth user was created successfully
        }

        setSuccess(
          "Account created successfully! You can now optionally connect your wallet for enhanced features."
        );
        setStep(2); // Move to wallet connection step
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = () => {
    toast.success("Wallet connected successfully!");
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const skipWalletConnection = () => {
    toast.success(
      "Account created! You can connect your wallet later from settings."
    );
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Success message */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Account Created!
                  </h3>
                  <p className="text-sm text-green-600">
                    Welcome to TangibleFi, {formData.fullName}!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet connection step */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Connect Your Wallet (Optional)
              </CardTitle>
              <CardDescription className="text-blue-200">
                Enhanced features with wallet-based authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
                <h4 className="text-blue-100 font-medium mb-2">
                  Wallet Benefits:
                </h4>
                <ul className="space-y-1 text-sm text-blue-200">
                  <li>• Secure transaction signing</li>
                  <li>• Direct loan disbursements</li>
                  <li>• Cross-chain asset management</li>
                  <li>• DeFi protocol integrations</li>
                </ul>
              </div>

              <MetaMaskConnect
                variant="button"
                onSuccess={handleWalletConnected}
                onError={(error) => toast.error(error)}
              />

              <div className="text-center space-y-3">
                <p className="text-sm text-blue-200">
                  You can connect your wallet later from your profile settings
                </p>
                <Button
                  onClick={skipWalletConnection}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Skip for Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-white">Create Account</h1>
            <p className="text-xl text-blue-200">
              Join the future of real-world asset tokenization
            </p>
          </div>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center">
              Get Started with Email
            </CardTitle>
            <CardDescription className="text-blue-200 text-center">
              Create your account to access tokenized assets and DeFi lending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/20 border-red-400/30">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-100">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/20 border-green-400/30">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-100">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Account Type Selection */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Account Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("accountType", "personal")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.accountType === "personal"
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <UserCircle className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-white text-sm font-medium">
                      Personal
                    </div>
                    <div className="text-blue-200 text-xs">
                      Individual investor
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("accountType", "business")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.accountType === "business"
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Building className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-white text-sm font-medium">
                      Business
                    </div>
                    <div className="text-blue-200 text-xs">
                      Corporate entity
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-white font-medium flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  required
                />
              </div>

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
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-white font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-blue-200">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="text-center space-y-4">
          <h3 className="text-white font-semibold">
            What you'll get access to:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <Building className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">Asset Tokenization</div>
              <div className="text-blue-200 text-xs">
                Convert real-world assets to tokens
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <Wallet className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">DeFi Lending</div>
              <div className="text-blue-200 text-xs">
                Competitive rates starting at 4.25%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
