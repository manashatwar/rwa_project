import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Zap,
} from "lucide-react";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardContent className="p-6">
              <FormMessage message={searchParams} />
            </CardContent>
          </Card>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <SmtpMessage />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      TangibleFi
                    </h2>
                    <p className="text-gray-600">Multi-Chain Platform</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Join 10,000+ users
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    Start your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      RWA journey
                    </span>{" "}
                    today
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Tokenize your real-world assets, access instant liquidity,
                    and join the future of decentralized finance across multiple
                    blockchains.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      $500M+ Assets Tokenized
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real estate, commodities, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      5+ Blockchain Networks
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ethereum, Polygon, Arbitrum & more
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Instant Setup
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get started in under 2 minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      No Setup Fees
                    </h4>
                    <p className="text-sm text-gray-600">
                      Start tokenizing your assets with zero upfront costs. Only
                      pay when you access liquidity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto lg:hidden">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      Create account
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Start tokenizing your assets today
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <UrlProvider>
                    <form className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="full_name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="full_name"
                              name="full_name"
                              type="text"
                              placeholder="John Doe"
                              required
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type="password"
                              name="password"
                              placeholder="Create a strong password"
                              minLength={6}
                              required
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Must be at least 6 characters long
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <SubmitButton
                          formAction={signUpAction}
                          pendingText="Creating account..."
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <span className="flex items-center justify-center gap-2">
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </SubmitButton>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-600">
                              Secure signup
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">
                              No setup fees
                            </span>
                          </div>
                        </div>
                      </div>

                      <FormMessage message={searchParams} />
                    </form>
                  </UrlProvider>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">
                          Already have an account?
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/sign-in"
                      className="w-full flex items-center justify-center gap-2 h-12 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-200 hover:bg-blue-50"
                    >
                      Sign in to your account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* SMTP Message at Bottom */}
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <SmtpMessage />
        </div>
      </div>
    </>
  );
}
