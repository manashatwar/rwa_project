"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoanCalculatorPage() {
  const [calculationType, setCalculationType] = useState("payment");
  const [loanInputs, setLoanInputs] = useState({
    loanAmount: 100000,
    interestRate: 8.5,
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
    const requiredIncome = monthlyPayment * 12 * 3; // 3x annual income rule

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Calculator</h1>
          <p className="text-gray-600 mt-2">
            Calculate loan payments, affordability, and compare different
            scenarios
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">Interactive Tool</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calculation Type */}
              <div className="space-y-3">
                <Label>Calculation Type</Label>
                <Select
                  value={calculationType}
                  onValueChange={setCalculationType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Monthly Payment</SelectItem>
                    <SelectItem value="affordability">
                      Loan Affordability
                    </SelectItem>
                    <SelectItem value="comparison">
                      Scenario Comparison
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Value */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Asset Value
                </Label>
                <Input
                  type="number"
                  value={loanInputs.assetValue}
                  onChange={(e) =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      assetValue: Number(e.target.value),
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  Estimated market value of your asset
                </p>
              </div>

              {/* LTV Ratio */}
              <div className="space-y-3">
                <Label className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Loan-to-Value Ratio
                  </span>
                  <span className="text-sm font-normal">
                    {loanInputs.ltvRatio}%
                  </span>
                </Label>
                <Slider
                  value={[loanInputs.ltvRatio]}
                  onValueChange={(value) =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      ltvRatio: value[0],
                    }))
                  }
                  max={80}
                  min={20}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Conservative (20%)</span>
                  <span>Maximum (80%)</span>
                </div>
              </div>

              {/* Loan Amount */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Loan Amount
                </Label>
                <Input
                  type="number"
                  value={loanInputs.loanAmount}
                  onChange={(e) =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      loanAmount: Number(e.target.value),
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  Maximum: {formatCurrency(results.maxLoanAmount)}
                </p>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <Label className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Annual Interest Rate
                  </span>
                  <span className="text-sm font-normal">
                    {loanInputs.interestRate}%
                  </span>
                </Label>
                <Slider
                  value={[loanInputs.interestRate]}
                  onValueChange={(value) =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      interestRate: value[0],
                    }))
                  }
                  max={15}
                  min={2}
                  step={0.25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (2%)</span>
                  <span>High (15%)</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Conservative", ltv: 50, rate: 6.5, term: 12 },
                { name: "Balanced", ltv: 65, rate: 8.0, term: 18 },
                { name: "Aggressive", ltv: 75, rate: 10.0, term: 24 },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      ltvRatio: preset.ltv,
                      interestRate: preset.rate,
                      loanTerm: preset.term,
                    }))
                  }
                >
                  <div className="text-left">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-500">
                      {preset.ltv}% LTV • {preset.rate}% APR • {preset.term}mo
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Monthly Payment
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Interest
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                  <Percent className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Payment
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>
                  <Calculator className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Max Loan
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(results.maxLoanAmount)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="schedule">Amortization</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-semibold">
                          {formatCurrency(loanInputs.loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-semibold">
                          {formatPercent(loanInputs.interestRate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Term:</span>
                        <span className="font-semibold">
                          {loanInputs.loanTerm} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">LTV Ratio:</span>
                        <span className="font-semibold">
                          {formatPercent(loanInputs.ltvRatio)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(results.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(results.totalInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(results.totalPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Interest Percentage:
                        </span>
                        <span className="font-semibold">
                          {formatPercent(
                            (results.totalInterest / loanInputs.loanAmount) *
                              100
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Amortization Schedule
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Payment</th>
                          <th className="text-right p-2">Principal</th>
                          <th className="text-right p-2">Interest</th>
                          <th className="text-right p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationSchedule.map((row) => (
                          <tr
                            key={row.month}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 font-medium">{row.month}</td>
                            <td className="text-right p-2">
                              {formatCurrency(row.payment)}
                            </td>
                            <td className="text-right p-2 text-blue-600">
                              {formatCurrency(row.principal)}
                            </td>
                            <td className="text-right p-2 text-orange-600">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="text-right p-2 font-medium">
                              {formatCurrency(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {amortizationSchedule.length >= 24 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Showing first 24 months • Full schedule available in
                      export
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Principal</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(loanInputs.loanAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">Interest</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(results.totalInterest)}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total Cost</span>
                          <span>{formatCurrency(results.totalPayment)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Affordability Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Income Requirement
                        </h4>
                        <p className="text-blue-700 text-sm mb-2">
                          Recommended minimum annual income:{" "}
                          {formatCurrency(results.requiredIncome)}
                        </p>
                        <p className="text-blue-600 text-xs">
                          Based on 33% debt-to-income ratio
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monthly payment:</span>
                          <span>{formatCurrency(results.monthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>As % of $5k income:</span>
                          <span
                            className={
                              results.monthlyPayment / 5000 > 0.33
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {formatPercent(
                              (results.monthlyPayment / 5000) * 100
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
