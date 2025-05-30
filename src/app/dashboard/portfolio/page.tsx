"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Coins,
  Activity,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const portfolioData = {
  totalValue: 1250000,
  totalGain: 125000,
  totalGainPercent: 11.1,
  dayChange: 15420,
  dayChangePercent: 1.25,
  assets: [
    {
      id: "1",
      name: "Manhattan Apartment",
      type: "Real Estate",
      value: 750000,
      allocation: 60,
      gain: 75000,
      gainPercent: 11.1,
      tokenized: true,
      liquidity: "Medium",
      riskLevel: "Low",
    },
    {
      id: "2",
      name: "Gold Reserves",
      type: "Commodity",
      value: 250000,
      allocation: 20,
      gain: 25000,
      gainPercent: 11.1,
      tokenized: true,
      liquidity: "High",
      riskLevel: "Medium",
    },
    {
      id: "3",
      name: "Equipment Portfolio",
      type: "Equipment",
      value: 150000,
      allocation: 12,
      gain: 15000,
      gainPercent: 11.1,
      tokenized: true,
      liquidity: "Low",
      riskLevel: "Medium",
    },
    {
      id: "4",
      name: "Cash & Stablecoins",
      type: "Cash",
      value: 100000,
      allocation: 8,
      gain: 2500,
      gainPercent: 2.5,
      tokenized: false,
      liquidity: "Very High",
      riskLevel: "Very Low",
    },
  ],
  performance: {
    "1D": 1.25,
    "1W": 2.8,
    "1M": 5.2,
    "3M": 8.7,
    "6M": 15.3,
    "1Y": 22.1,
  },
};

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState("1Y");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low":
        return "bg-green-100 text-green-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Very High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity) {
      case "Very High":
        return "bg-emerald-100 text-emerald-800";
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Portfolio Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Track your asset performance and allocation
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
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolioData.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p
              className={`text-sm mt-2 ${getPerformanceColor(portfolioData.totalGain)}`}
            >
              +{formatCurrency(portfolioData.totalGain)} (
              {portfolioData.totalGainPercent}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Day Change</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolioData.dayChange)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p
              className={`text-sm mt-2 ${getPerformanceColor(portfolioData.dayChange)}`}
            >
              +{portfolioData.dayChangePercent}% today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Assets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioData.assets.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-500">
              {portfolioData.assets.filter((a) => a.tokenized).length} tokenized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  +
                  {
                    portfolioData.performance[
                      timeframe as keyof typeof portfolioData.performance
                    ]
                  }
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm mt-2 text-emerald-600">
              {timeframe} performance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          asset.type === "Real Estate"
                            ? "#3B82F6"
                            : asset.type === "Commodity"
                              ? "#F59E0B"
                              : asset.type === "Equipment"
                                ? "#8B5CF6"
                                : "#10B981",
                      }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {asset.type}
                      </p>
                      <p className="text-xs text-gray-500">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {asset.allocation}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(asset.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Portfolio Performance
                </h3>
                <p className="text-gray-600 mb-4">
                  Your portfolio has grown by {portfolioData.totalGainPercent}%
                  over the selected period
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {Object.entries(portfolioData.performance).map(
                    ([period, performance]) => (
                      <div
                        key={period}
                        className="bg-white rounded-lg p-3 shadow-sm"
                      >
                        <p className="text-xs text-gray-500">{period}</p>
                        <p
                          className={`font-semibold ${getPerformanceColor(performance)}`}
                        >
                          +{performance}%
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Asset Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Asset Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {asset.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{asset.type}</span>
                      {asset.tokenized && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Tokenized
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Value</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(asset.value)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Allocation</p>
                    <p className="font-semibold text-gray-900">
                      {asset.allocation}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Gain/Loss</p>
                    <p
                      className={`font-semibold ${getPerformanceColor(asset.gain)}`}
                    >
                      +{formatCurrency(asset.gain)} ({asset.gainPercent}%)
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Risk</p>
                    <Badge
                      className={`${getRiskColor(asset.riskLevel)} text-xs`}
                    >
                      {asset.riskLevel}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Liquidity</p>
                    <Badge
                      className={`${getLiquidityColor(asset.liquidity)} text-xs`}
                    >
                      {asset.liquidity}
                    </Badge>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
