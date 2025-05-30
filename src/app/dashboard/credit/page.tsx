"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  ArrowUpRight,
  History,
  Target,
  Award,
  Clock,
  XCircle,
  TrendingDown,
  Star,
  Wallet,
  Building,
  Percent,
  BarChart3,
} from "lucide-react";
import { User } from "@supabase/supabase-js";

interface UserCredit {
  available: number;
  total: number;
  used: number;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierAmount: number;
  monthlySpent: number;
  paymentHistory: "Excellent" | "Good" | "Fair" | "Poor";
  creditScore: number;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  dueDate: string;
  paidDate: string;
  status: "on_time" | "late" | "missed";
  loanId: string;
  assetName: string;
  daysLate?: number;
}

interface CreditScoreFactors {
  paymentHistory: number; // 35%
  creditUtilization: number; // 30%
  creditLength: number; // 15%
  loanDiversity: number; // 10%
  newCredit: number; // 10%
}

export default function CreditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userCredit, setUserCredit] = useState<UserCredit | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [creditFactors, setCreditFactors] = useState<CreditScoreFactors | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchUserCredit(user.id);
        await fetchPaymentHistory(user.id);
        await fetchCreditFactors(user.id);
      }
    };

    getUser();
  }, []);

  const fetchUserCredit = async (userId: string) => {
    // Mock credit data with calculated credit score
    const mockCredit: UserCredit = {
      available: 125000,
      total: 150000, // Higher limit due to good credit score
      used: 25000,
      level: "Platinum",
      nextTierAmount: 0, // Already at highest tier
      monthlySpent: 8500,
      paymentHistory: "Excellent",
      creditScore: 785, // High credit score
    };

    setUserCredit(mockCredit);
  };

  const fetchPaymentHistory = async (userId: string) => {
    // Mock payment history data
    const mockHistory: PaymentHistoryItem[] = [
      {
        id: "1",
        amount: 2500,
        dueDate: "2024-01-15",
        paidDate: "2024-01-14",
        status: "on_time",
        loanId: "loan_1",
        assetName: "Downtown Office Building",
      },
      {
        id: "2",
        amount: 3200,
        dueDate: "2024-02-15",
        paidDate: "2024-02-15",
        status: "on_time",
        loanId: "loan_2",
        assetName: "Warehouse Property",
      },
      {
        id: "3",
        amount: 2500,
        dueDate: "2024-03-15",
        paidDate: "2024-03-20",
        status: "late",
        loanId: "loan_1",
        assetName: "Downtown Office Building",
        daysLate: 5,
      },
      {
        id: "4",
        amount: 3200,
        dueDate: "2024-04-15",
        paidDate: "2024-04-14",
        status: "on_time",
        loanId: "loan_2",
        assetName: "Warehouse Property",
      },
      {
        id: "5",
        amount: 2500,
        dueDate: "2024-05-15",
        paidDate: "2024-05-13",
        status: "on_time",
        loanId: "loan_1",
        assetName: "Downtown Office Building",
      },
      {
        id: "6",
        amount: 3200,
        dueDate: "2024-06-15",
        paidDate: "2024-06-15",
        status: "on_time",
        loanId: "loan_2",
        assetName: "Warehouse Property",
      },
    ];

    setPaymentHistory(mockHistory);
  };

  const fetchCreditFactors = async (userId: string) => {
    // Calculate credit score factors
    const factors: CreditScoreFactors = {
      paymentHistory: 92, // Excellent payment history
      creditUtilization: 85, // Good utilization (16.7%)
      creditLength: 78, // Good credit history length
      loanDiversity: 82, // Good mix of loan types
      newCredit: 88, // Responsible new credit usage
    };

    setCreditFactors(factors);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 700) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 650) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 600) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getCreditScoreRating = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 600) return "Poor";
    return "Very Poor";
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "on_time":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "missed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "on_time":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "late":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "missed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCreditUsagePercentage = () => {
    if (!userCredit) return 0;
    return (userCredit.used / userCredit.total) * 100;
  };

  const getLoanEligibility = (creditScore: number) => {
    if (creditScore >= 750) {
      return {
        maxAmount: 500000,
        interestRate: 4.5,
        status: "Pre-approved",
        color: "emerald",
      };
    } else if (creditScore >= 700) {
      return {
        maxAmount: 350000,
        interestRate: 5.5,
        status: "Excellent",
        color: "blue",
      };
    } else if (creditScore >= 650) {
      return {
        maxAmount: 200000,
        interestRate: 7.0,
        status: "Good",
        color: "yellow",
      };
    } else if (creditScore >= 600) {
      return {
        maxAmount: 100000,
        interestRate: 9.0,
        status: "Fair",
        color: "orange",
      };
    } else {
      return {
        maxAmount: 50000,
        interestRate: 12.0,
        status: "Limited",
        color: "red",
      };
    }
  };

  if (!userCredit || !creditFactors) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credit information...</p>
        </div>
      </div>
    );
  }

  const eligibility = getLoanEligibility(userCredit.creditScore);
  const onTimePayments = paymentHistory.filter(p => p.status === "on_time").length;
  const totalPayments = paymentHistory.length;
  const onTimePercentage = totalPayments > 0 ? (onTimePayments / totalPayments) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Credit Management
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Monitor your credit score and loan eligibility
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <a href="/dashboard/loans/new">
              <Plus className="h-5 w-5 mr-2" />
              Apply for Loan
            </a>
          </Button>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Credit Score Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm col-span-1">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Award className="h-6 w-6 text-yellow-600" />
                Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(userCredit.creditScore / 850) * 251.2} 251.2`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {userCredit.creditScore}
                      </p>
                      <p className="text-sm text-gray-600">/ 850</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold ${getCreditScoreColor(userCredit.creditScore)}`}>
                <Star className="h-4 w-4" />
                {getCreditScoreRating(userCredit.creditScore)}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">On-time Payments</span>
                  <span className="font-semibold text-emerald-600">{onTimePercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credit Utilization</span>
                  <span className="font-semibold text-blue-600">{getCreditUsagePercentage().toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credit History</span>
                  <span className="font-semibold text-purple-600">2.5 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Eligibility */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-blue-600" />
                Loan Eligibility
              </CardTitle>
              <CardDescription>
                Based on your credit score of {userCredit.creditScore}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`p-4 rounded-xl border bg-${eligibility.color}-50 border-${eligibility.color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className={`h-5 w-5 text-${eligibility.color}-600`} />
                    <span className={`text-sm font-semibold text-${eligibility.color}-600 uppercase tracking-wide`}>
                      Max Loan Amount
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(eligibility.maxAmount)}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border bg-${eligibility.color}-50 border-${eligibility.color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className={`h-5 w-5 text-${eligibility.color}-600`} />
                    <span className={`text-sm font-semibold text-${eligibility.color}-600 uppercase tracking-wide`}>
                      Interest Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {eligibility.interestRate}% APR
                  </p>
                </div>

                <div className={`p-4 rounded-xl border bg-${eligibility.color}-50 border-${eligibility.color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`h-5 w-5 text-${eligibility.color}-600`} />
                    <span className={`text-sm font-semibold text-${eligibility.color}-600 uppercase tracking-wide`}>
                      Approval Status
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {eligibility.status}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      How to Improve Your Credit Score
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Pay all loan EMIs on time</li>
                      <li>• Keep credit utilization below 30%</li>
                      <li>• Maintain a longer credit history</li>
                      <li>• Diversify your loan portfolio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Score Factors */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Credit Score Factors
            </CardTitle>
            <CardDescription>
              Breakdown of factors affecting your credit score
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { name: "Payment History", score: creditFactors.paymentHistory, weight: "35%", icon: History },
                { name: "Credit Utilization", score: creditFactors.creditUtilization, weight: "30%", icon: CreditCard },
                { name: "Credit Length", score: creditFactors.creditLength, weight: "15%", icon: Calendar },
                { name: "Loan Diversity", score: creditFactors.loanDiversity, weight: "10%", icon: Building },
                { name: "New Credit", score: creditFactors.newCredit, weight: "10%", icon: Zap },
              ].map((factor, index) => {
                const Icon = factor.icon;
                const getScoreColor = (score: number) => {
                  if (score >= 80) return "emerald";
                  if (score >= 60) return "blue";
                  if (score >= 40) return "yellow";
                  return "red";
                };
                const color = getScoreColor(factor.score);

                return (
                  <div key={factor.name} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 bg-${color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 text-${color}-600`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{factor.name}</h4>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{factor.score}/100</p>
                    <p className="text-sm text-gray-600">{factor.weight} weight</p>
                    <div className="mt-3">
                      <Progress 
                        value={factor.score} 
                        className={`h-2 bg-${color}-100`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-6 w-6 text-emerald-600" />
              Payment History
            </CardTitle>
            <CardDescription>
              Your recent loan payment track record ({onTimePayments}/{totalPayments} payments on time)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getPaymentStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{payment.assetName}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(payment.dueDate).toLocaleDateString()} • 
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                        {payment.daysLate && (
                          <span className="text-yellow-600"> ({payment.daysLate} days late)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getPaymentStatusColor(payment.status)} font-medium capitalize`}
                    >
                      {payment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" size="lg">
                <History className="h-4 w-4 mr-2" />
                View Full Payment History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
