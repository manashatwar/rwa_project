"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Globe,
  Building2,
  Coins,
  BarChart3,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  Target,
} from "lucide-react";

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
  icon: any;
}

interface AssetCategory {
  name: string;
  totalValue: number;
  assets: number;
  change24h: number;
  icon: any;
}

const mockMarketData: MarketData[] = [
  {
    name: "Manhattan Real Estate Token",
    symbol: "MRE-001",
    price: 847.50,
    change24h: 2.34,
    volume24h: 1250000,
    marketCap: 42500000,
    category: "Real Estate",
    icon: Building2,
  },
  {
    name: "Gold Reserve Token",
    symbol: "GRT-001",
    price: 1987.20,
    change24h: -0.85,
    volume24h: 850000,
    marketCap: 85000000,
    category: "Commodities",
    icon: Coins,
  },
  {
    name: "Industrial Equipment Fund",
    symbol: "IEF-001",
    price: 425.80,
    change24h: 1.75,
    volume24h: 450000,
    marketCap: 12500000,
    category: "Equipment",
    icon: Target,
  },
  {
    name: "Luxury Art Collection",
    symbol: "LAC-001",
    price: 12450.00,
    change24h: 5.67,
    volume24h: 2100000,
    marketCap: 156000000,
    category: "Art & Collectibles",
    icon: Eye,
  },
];

const assetCategories: AssetCategory[] = [
  {
    name: "Real Estate",
    totalValue: 2400000000,
    assets: 156,
    change24h: 2.1,
    icon: Building2,
  },
  {
    name: "Commodities",
    totalValue: 1850000000,
    assets: 89,
    change24h: -0.5,
    icon: Coins,
  },
  {
    name: "Equipment",
    totalValue: 750000000,
    assets: 234,
    change24h: 1.8,
    icon: Target,
  },
  {
    name: "Art & Collectibles",
    totalValue: 450000000,
    assets: 67,
    change24h: 4.2,
    icon: Eye,
  },
];

export default function MarketStatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage > 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(percentage).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Status</h1>
          <p className="text-gray-600 mt-1">Real-time tokenized asset market data</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Market Cap</p>
                <p className="text-2xl font-bold text-blue-900">$5.45B</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {formatPercentage(2.34)}
              <span className="text-xs text-blue-600 ml-2">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">24h Volume</p>
                <p className="text-2xl font-bold text-emerald-900">$124.8M</p>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {formatPercentage(15.7)}
              <span className="text-xs text-emerald-600 ml-2">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-purple-900">546</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {formatPercentage(8.2)}
              <span className="text-xs text-purple-600 ml-2">new this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Active Traders</p>
                <p className="text-2xl font-bold text-orange-900">12.4K</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {formatPercentage(12.5)}
              <span className="text-xs text-orange-600 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Asset Categories Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assetCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.assets} assets</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Value</span>
                      <span className="font-semibold">{formatCurrency(category.totalValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">24h Change</span>
                      {formatPercentage(category.change24h)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMarketData.map((asset, index) => {
              const Icon = asset.icon;
              return (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{asset.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="font-semibold text-gray-900">
                        ${asset.price.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end">
                        {formatPercentage(asset.change24h)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Volume (24h)</p>
                      <p className="font-semibold">{formatCurrency(asset.volume24h)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Market Cap</p>
                      <p className="font-semibold">{formatCurrency(asset.marketCap)}</p>
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Market Status Indicator */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            Markets are open and trading normally
          </span>
        </div>
      </div>
    </div>
  );
} 