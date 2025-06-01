"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  DollarSign,
  PieChart,
  Activity,
  Award,
  ArrowUp,
  ArrowDown,
  Zap,
  Gauge,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const performanceMetrics = {
  overall: {
    totalReturn: 25.4,
    annualizedReturn: 18.7,
    volatility: 12.3,
    sharpeRatio: 1.52,
    maxDrawdown: -8.2,
    winRate: 73.5,
  },
  periods: [
    { name: "1 Day", return: 0.8, benchmark: 0.5, volatility: 2.1 },
    { name: "1 Week", return: 2.1, benchmark: 1.8, volatility: 3.4 },
    { name: "1 Month", return: 8.3, benchmark: 6.2, volatility: 5.7 },
    { name: "3 Months", return: 11.1, benchmark: 9.4, volatility: 8.2 },
    { name: "6 Months", return: 18.7, benchmark: 14.2, volatility: 10.5 },
    { name: "1 Year", return: 25.4, benchmark: 19.8, volatility: 12.3 },
  ],
  assetPerformance: [
    {
      name: "Manhattan Apartment",
      type: "Real Estate",
      return: 28.3,
      volatility: 8.1,
      sharpe: 2.1,
      contribution: 45,
      status: "outperform",
    },
    {
      name: "Gold Reserves",
      type: "Commodity",
      return: 22.1,
      volatility: 15.2,
      sharpe: 1.2,
      contribution: 25,
      status: "inline",
    },
    {
      name: "Equipment Portfolio",
      type: "Equipment",
      return: 31.5,
      volatility: 18.7,
      sharpe: 1.8,
      contribution: 20,
      status: "outperform",
    },
    {
      name: "Cash & Equivalents",
      type: "Cash",
      return: 4.5,
      volatility: 0.5,
      sharpe: 3.0,
      contribution: 10,
      status: "underperform",
    },
  ],
  riskMetrics: {
    valueAtRisk: 45000,
    conditionalVar: 67500,
    beta: 0.85,
    alpha: 3.2,
    correlation: 0.68,
    tracking_error: 4.2,
  },
};

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState("1Y");

  const getPerformanceColor = (value: number, threshold: number = 0) => {
    return value > threshold ? "text-green-600" : "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "outperform":
        return "bg-green-100 text-green-800 border-green-200";
      case "inline":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "underperform":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Metrics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and performance insights for your portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Total Return
                </p>
                <p className="text-lg font-bold text-green-600">
                  +{performanceMetrics.overall.totalReturn}%
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Annualized</p>
                <p className="text-lg font-bold text-green-600">
                  +{performanceMetrics.overall.annualizedReturn}%
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Volatility</p>
                <p className="text-lg font-bold text-orange-600">
                  {performanceMetrics.overall.volatility}%
                </p>
              </div>
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Sharpe Ratio
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {performanceMetrics.overall.sharpeRatio}
                </p>
              </div>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Max Drawdown
                </p>
                <p className="text-lg font-bold text-red-600">
                  {performanceMetrics.overall.maxDrawdown}%
                </p>
              </div>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Win Rate</p>
                <p className="text-lg font-bold text-purple-600">
                  {performanceMetrics.overall.winRate}%
                </p>
              </div>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance by Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.periods.map((period) => (
                <div
                  key={period.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {period.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${getPerformanceColor(period.return)}`}
                      >
                        {period.return > 0 ? "+" : ""}
                        {period.return}%
                      </span>
                      <p className="text-xs text-gray-500">
                        vs {period.benchmark}%
                      </p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(Math.min(Math.abs(period.return), 30) / 30) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Value at Risk (95%)
                </span>
                <span className="text-sm font-semibold text-red-600">
                  -$
                  {performanceMetrics.riskMetrics.valueAtRisk.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Conditional VaR
                </span>
                <span className="text-sm font-semibold text-red-600">
                  -$
                  {performanceMetrics.riskMetrics.conditionalVar.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Beta</span>
                <span className="text-sm font-semibold text-blue-600">
                  {performanceMetrics.riskMetrics.beta}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Alpha</span>
                <span className="text-sm font-semibold text-green-600">
                  +{performanceMetrics.riskMetrics.alpha}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Correlation
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {performanceMetrics.riskMetrics.correlation}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Tracking Error
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {performanceMetrics.riskMetrics.tracking_error}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Asset Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.assetPerformance.map((asset) => (
              <div
                key={asset.name}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-gray-500">{asset.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Return</p>
                    <p
                      className={`font-semibold ${getPerformanceColor(asset.return)}`}
                    >
                      +{asset.return}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Volatility</p>
                    <p className="font-semibold text-orange-600">
                      {asset.volatility}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Sharpe</p>
                    <p className="font-semibold text-blue-600">
                      {asset.sharpe}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Contribution</p>
                    <p className="font-semibold text-gray-900">
                      {asset.contribution}%
                    </p>
                  </div>

                  <Badge className={getStatusBadge(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Attribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asset Selection</span>
                <span className="text-sm font-semibold text-green-600">
                  +4.2%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asset Allocation</span>
                <span className="text-sm font-semibold text-green-600">
                  +2.8%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Timing</span>
                <span className="text-sm font-semibold text-green-600">
                  +1.6%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Currency Impact</span>
                <span className="text-sm font-semibold text-red-600">
                  -0.3%
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-900">Total Active Return</span>
                  <span className="text-green-600">+8.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Risk-Adjusted Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sharpe Ratio</span>
                <span className="text-sm font-semibold text-blue-600">
                  1.52
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sortino Ratio</span>
                <span className="text-sm font-semibold text-blue-600">
                  2.18
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Information Ratio</span>
                <span className="text-sm font-semibold text-blue-600">
                  1.97
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Calmar Ratio</span>
                <span className="text-sm font-semibold text-blue-600">
                  2.28
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Score</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Moderate
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
