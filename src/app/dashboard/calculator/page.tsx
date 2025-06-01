"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Info,
  Download,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  RefreshCw,
  Eye,
  Clock,
} from "lucide-react";

export default function LoanCalculatorPage() {
  const [calculationType, setCalculationType] = useState("payment");
  const [loanInputs, setLoanInputs] = useState({
    loanAmount: 100000,
    interestRate: 5.5,
    loanTerm: 12,
    assetValue: 150000,
    ltvRatio: 75,
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    maxLoanAmount: 0,
    requiredIncome: 0,
  });

  const [amortizationSchedule, setAmortizationSchedule] = useState<
    Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }>
  >([]);

  const [selectedPreset, setSelectedPreset] = useState("");

  const presets = [
    { label: "Real Estate", loanAmount: 500000, rate: 4.5, term: 360, ltv: 80 },
    {
      label: "Luxury Vehicle",
      loanAmount: 75000,
      rate: 6.5,
      term: 60,
      ltv: 75,
    },
    {
      label: "Art Collection",
      loanAmount: 250000,
      rate: 5.25,
      term: 120,
      ltv: 70,
    },
    { label: "Equipment", loanAmount: 150000, rate: 7.0, term: 84, ltv: 75 },
  ];

  useEffect(() => {
    calculateLoan();
  }, [loanInputs, calculationType]);

  const calculateLoan = () => {
    const { loanAmount, interestRate, loanTerm, assetValue, ltvRatio } =
      loanInputs;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    // Monthly Payment Calculation
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    const maxLoanAmount = (assetValue * ltvRatio) / 100;
    const requiredIncome = monthlyPayment * 12 * 3;

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      maxLoanAmount,
      requiredIncome,
    });

    // Generate Amortization Schedule
    generateAmortizationSchedule(
      loanAmount,
      monthlyRate,
      numPayments,
      monthlyPayment
    );
  };

  const generateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    numPayments: number,
    payment: number
  ) => {
    const schedule = [];
    let balance = principal;

    for (let month = 1; month <= Math.min(numPayments, 24); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = payment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });

      if (balance <= 0) break;
    }

    setAmortizationSchedule(schedule);
  };

  const applyPreset = (preset: any) => {
    setLoanInputs({
      ...loanInputs,
      loanAmount: preset.loanAmount,
      interestRate: preset.rate,
      loanTerm: preset.term,
      ltvRatio: preset.ltv,
      assetValue: Math.round(preset.loanAmount / (preset.ltv / 100)),
    });
    setSelectedPreset(preset.label);
  };

  const resetCalculator = () => {
    setLoanInputs({
      loanAmount: 100000,
      interestRate: 5.5,
      loanTerm: 12,
      assetValue: 150000,
      ltvRatio: 75,
    });
    setSelectedPreset("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  const getRateColor = (rate: number) => {
    if (rate <= 4) return "text-green-600 bg-green-50";
    if (rate <= 6) return "text-blue-600 bg-blue-50";
    if (rate <= 8) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Advanced Loan Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Calculate loan payments, analyze scenarios, and make informed
            decisions about asset-backed financing
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Calculations
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Secure & Private
            </Badge>
          </div>
        </div>

        {/* Quick Presets */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Quick Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant={
                    selectedPreset === preset.label ? "default" : "outline"
                  }
                  onClick={() => applyPreset(preset)}
                  className={`h-auto p-4 text-left transition-all duration-200 ${
                    selectedPreset === preset.label
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:shadow-md hover:border-blue-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{preset.label}</div>
                    <div className="text-sm opacity-75">
                      {formatCurrency(preset.loanAmount)} • {preset.rate}% •{" "}
                      {preset.term}mo
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Input Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Loan Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Asset Value */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Asset Value
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={loanInputs.assetValue}
                      onChange={(e) =>
                        setLoanInputs((prev) => ({
                          ...prev,
                          assetValue: Number(e.target.value),
                        }))
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Current market value of your asset
                  </p>
                </div>

                {/* LTV Ratio */}
                <div className="space-y-4">
                  <Label className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-600" />
                      Loan-to-Value Ratio
                    </span>
                    <Badge
                      className={`text-xs px-2 py-1 ${
                        loanInputs.ltvRatio <= 60
                          ? "bg-green-100 text-green-800"
                          : loanInputs.ltvRatio <= 75
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {loanInputs.ltvRatio}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[loanInputs.ltvRatio]}
                    onValueChange={(value) =>
                      setLoanInputs((prev) => ({
                        ...prev,
                        ltvRatio: value[0],
                      }))
                    }
                    max={85}
                    min={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Conservative</span>
                    <span>Standard</span>
                    <span>Aggressive</span>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    Max Loan:{" "}
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(
                        (loanInputs.assetValue * loanInputs.ltvRatio) / 100
                      )}
                    </span>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    Loan Amount
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={loanInputs.loanAmount}
                      onChange={(e) =>
                        setLoanInputs((prev) => ({
                          ...prev,
                          loanAmount: Number(e.target.value),
                        }))
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Percent className="w-4 h-4 text-orange-600" />
                    Interest Rate
                  </Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.1"
                      value={loanInputs.interestRate}
                      onChange={(e) =>
                        setLoanInputs((prev) => ({
                          ...prev,
                          interestRate: Number(e.target.value),
                        }))
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div
                    className={`text-xs px-3 py-2 rounded-lg ${getRateColor(loanInputs.interestRate)}`}
                  >
                    {loanInputs.interestRate <= 4
                      ? "Excellent Rate"
                      : loanInputs.interestRate <= 6
                        ? "Good Rate"
                        : loanInputs.interestRate <= 8
                          ? "Standard Rate"
                          : "High Rate"}
                  </div>
                </div>

                {/* Loan Term */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Loan Term (Months)
                  </Label>
                  <Select
                    value={loanInputs.loanTerm.toString()}
                    onValueChange={(value) =>
                      setLoanInputs((prev) => ({
                        ...prev,
                        loanTerm: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                      <SelectItem value="84">84 months</SelectItem>
                      <SelectItem value="120">120 months</SelectItem>
                      <SelectItem value="240">240 months</SelectItem>
                      <SelectItem value="360">360 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={resetCalculator}
                  className="w-full h-12 border-gray-200 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Calculator
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Results Panel */}
          <div className="xl:col-span-3 space-y-6">
            {/* Key Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <Badge className="bg-blue-200 text-blue-800">Monthly</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-700 font-medium">
                      Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                    <Badge className="bg-emerald-200 text-emerald-800">
                      Total
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-emerald-700 font-medium">
                      Total Interest
                    </p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <Badge className="bg-purple-200 text-purple-800">
                      Total
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-purple-700 font-medium">
                      Total Payment
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Target className="w-8 h-8 text-orange-600" />
                    <Badge className="bg-orange-200 text-orange-800">Max</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-orange-700 font-medium">
                      Max Loan Amount
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {formatCurrency(results.maxLoanAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Tabs defaultValue="schedule" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="schedule"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Payment Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="breakdown"
                  className="flex items-center gap-2"
                >
                  <PieChart className="w-4 h-4" />
                  Cost Breakdown
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Payment Schedule Calendar (First 24 Months)
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Visual monthly payment schedule with color-coded payment
                      amounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Calendar Grid Layout */}
                    <div className="space-y-6">
                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm text-gray-700">
                            Low Balance Period
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                          <span className="text-sm text-gray-700">
                            Mid Balance Period
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span className="text-sm text-gray-700">
                            High Balance Period
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500 rounded"></div>
                          <span className="text-sm text-gray-700">
                            Initial Period
                          </span>
                        </div>
                      </div>

                      {/* Year 1 (Months 1-12) */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Year 1 (Months 1-12)
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                          {amortizationSchedule
                            .slice(0, 12)
                            .map((payment, index) => {
                              // Color coding based on remaining balance percentage
                              const balanceRatio =
                                payment.balance / loanInputs.loanAmount;
                              let colorClasses = "";
                              if (balanceRatio > 0.75) {
                                colorClasses =
                                  "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 text-purple-900";
                              } else if (balanceRatio > 0.5) {
                                colorClasses =
                                  "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 text-orange-900";
                              } else if (balanceRatio > 0.25) {
                                colorClasses =
                                  "bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-900";
                              } else {
                                colorClasses =
                                  "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-900";
                              }

                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border-2 hover:shadow-lg transition-all duration-200 hover:scale-105 ${colorClasses}`}
                                >
                                  <div className="space-y-2">
                                    <div className="font-bold text-sm">
                                      Month {payment.month}
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Payment:
                                        </span>
                                        <span className="font-semibold">
                                          {formatCurrency(payment.payment)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Principal:
                                        </span>
                                        <span className="font-medium">
                                          {formatCurrency(payment.principal)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Interest:
                                        </span>
                                        <span className="font-medium">
                                          {formatCurrency(payment.interest)}
                                        </span>
                                      </div>
                                      <div className="border-t pt-1 mt-2">
                                        <div className="flex justify-between">
                                          <span className="opacity-75">
                                            Balance:
                                          </span>
                                          <span className="font-bold text-xs">
                                            {formatCurrency(payment.balance)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Year 2 (Months 13-24) */}
                      {amortizationSchedule.length > 12 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            Year 2 (Months 13-24)
                          </h3>
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {amortizationSchedule
                              .slice(12, 24)
                              .map((payment, index) => {
                                // Color coding based on remaining balance percentage
                                const balanceRatio =
                                  payment.balance / loanInputs.loanAmount;
                                let colorClasses = "";
                                if (balanceRatio > 0.75) {
                                  colorClasses =
                                    "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 text-purple-900";
                                } else if (balanceRatio > 0.5) {
                                  colorClasses =
                                    "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 text-orange-900";
                                } else if (balanceRatio > 0.25) {
                                  colorClasses =
                                    "bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-900";
                                } else {
                                  colorClasses =
                                    "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-900";
                                }

                                return (
                                  <div
                                    key={index + 12}
                                    className={`p-4 rounded-lg border-2 hover:shadow-lg transition-all duration-200 hover:scale-105 ${colorClasses}`}
                                  >
                                    <div className="space-y-2">
                                      <div className="font-bold text-sm">
                                        Month {payment.month}
                                      </div>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="opacity-75">
                                            Payment:
                                          </span>
                                          <span className="font-semibold">
                                            {formatCurrency(payment.payment)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="opacity-75">
                                            Principal:
                                          </span>
                                          <span className="font-medium">
                                            {formatCurrency(payment.principal)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="opacity-75">
                                            Interest:
                                          </span>
                                          <span className="font-medium">
                                            {formatCurrency(payment.interest)}
                                          </span>
                                        </div>
                                        <div className="border-t pt-1 mt-2">
                                          <div className="flex justify-between">
                                            <span className="opacity-75">
                                              Balance:
                                            </span>
                                            <span className="font-bold text-xs">
                                              {formatCurrency(payment.balance)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Progress Overview */}
                      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          Loan Progress Overview
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Total Payments (24 months)
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatCurrency(
                                results.monthlyPayment *
                                  Math.min(24, loanInputs.loanTerm)
                              )}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Interest Paid (24 months)
                            </p>
                            <p className="text-xl font-bold text-orange-600">
                              {formatCurrency(
                                amortizationSchedule
                                  .slice(0, 24)
                                  .reduce(
                                    (sum, payment) => sum + payment.interest,
                                    0
                                  )
                              )}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Principal Paid (24 months)
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatCurrency(
                                amortizationSchedule
                                  .slice(0, 24)
                                  .reduce(
                                    (sum, payment) => sum + payment.principal,
                                    0
                                  )
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        Payment Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-700 font-medium">
                            Principal Amount
                          </span>
                          <span className="text-blue-900 font-bold">
                            {formatCurrency(loanInputs.loanAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="text-orange-700 font-medium">
                            Total Interest
                          </span>
                          <span className="text-orange-900 font-bold">
                            {formatCurrency(results.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                          <span className="text-purple-700 font-bold">
                            Total Cost
                          </span>
                          <span className="text-purple-900 font-bold text-lg">
                            {formatCurrency(results.totalPayment)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-600" />
                        Loan Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Effective APR:</span>
                          <span className="font-semibold">
                            {formatPercent(loanInputs.interestRate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Interest Cost Ratio:
                          </span>
                          <span className="font-semibold">
                            {formatPercent(
                              (results.totalInterest / loanInputs.loanAmount) *
                                100
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payoff Time:</span>
                          <span className="font-semibold">
                            {Math.floor(loanInputs.loanTerm / 12)} years{" "}
                            {loanInputs.loanTerm % 12} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Min Income Required:
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(results.requiredIncome)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      Financial Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`p-4 rounded-lg border-l-4 ${
                          loanInputs.ltvRatio <= 60
                            ? "bg-green-50 border-green-500"
                            : loanInputs.ltvRatio <= 75
                              ? "bg-blue-50 border-blue-500"
                              : "bg-orange-50 border-orange-500"
                        }`}
                      >
                        <h4 className="font-semibold mb-2">
                          LTV Risk Assessment
                        </h4>
                        <p className="text-sm">
                          {loanInputs.ltvRatio <= 60
                            ? "Conservative - Lower risk, better terms available"
                            : loanInputs.ltvRatio <= 75
                              ? "Standard - Good balance of risk and leverage"
                              : "Aggressive - Higher risk, consider reducing loan amount"}
                        </p>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-l-4 ${
                          loanInputs.interestRate <= 5
                            ? "bg-green-50 border-green-500"
                            : loanInputs.interestRate <= 7
                              ? "bg-blue-50 border-blue-500"
                              : "bg-red-50 border-red-500"
                        }`}
                      >
                        <h4 className="font-semibold mb-2">
                          Rate Competitiveness
                        </h4>
                        <p className="text-sm">
                          {loanInputs.interestRate <= 5
                            ? "Excellent rate - well below market average"
                            : loanInputs.interestRate <= 7
                              ? "Competitive rate - within market range"
                              : "Above market - consider shopping for better rates"}
                        </p>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-l-4 ${
                          results.totalInterest / loanInputs.loanAmount < 0.3
                            ? "bg-green-50 border-green-500"
                            : results.totalInterest / loanInputs.loanAmount <
                                0.6
                              ? "bg-blue-50 border-blue-500"
                              : "bg-orange-50 border-orange-500"
                        }`}
                      >
                        <h4 className="font-semibold mb-2">Cost Efficiency</h4>
                        <p className="text-sm">
                          {results.totalInterest / loanInputs.loanAmount < 0.3
                            ? "Efficient - Interest cost is reasonable"
                            : results.totalInterest / loanInputs.loanAmount <
                                0.6
                              ? "Moderate - Consider shorter term"
                              : "High cost - Significantly consider alternatives"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Optimization Suggestions
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Reducing loan term to{" "}
                            {Math.max(6, loanInputs.loanTerm - 12)} months could
                            save approximately{" "}
                            <span className="font-semibold text-green-600">
                              {formatCurrency(results.totalInterest * 0.15)}
                            </span>{" "}
                            in interest
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Percent className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>
                            A 1% rate reduction would save{" "}
                            <span className="font-semibold text-green-600">
                              {formatCurrency(
                                results.monthlyPayment *
                                  loanInputs.loanTerm *
                                  0.12
                              )}
                            </span>{" "}
                            over the loan term
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Making extra monthly payments of{" "}
                            <span className="font-semibold text-blue-600">
                              {formatCurrency(results.monthlyPayment * 0.1)}
                            </span>{" "}
                            could reduce total interest by 15-20%
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
