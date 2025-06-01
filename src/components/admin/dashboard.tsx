"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Zap,
  Shield,
  Database,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  // Mock real-time data - in production, this would come from your backend
  const platformMetrics = {
    totalValueLocked: { value: "2.97B", change: "+12.5%", trend: "up" },
    totalAssets: { value: "147", change: "+8", trend: "up" },
    activeUsers: { value: "2,384", change: "+127", trend: "up" },
    pendingApprovals: { value: "3", change: "-2", trend: "down" },
    totalVaults: { value: "89", change: "+5", trend: "up" },
    totalFees: { value: "45.8K", change: "+15.2%", trend: "up" },
    networkHealth: { value: "99.9%", change: "0%", trend: "stable" },
    alertsActive: { value: "2", change: "-1", trend: "down" },
  };

  const recentActivity = [
    {
      id: 1,
      type: "asset_approved",
      title: "Manhattan Property Approved",
      description: "Real estate asset worth $2.5M approved for tokenization",
      timestamp: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      type: "user_registered",
      title: "New User Registration",
      description: "Wallet 0x742d...1234 completed verification",
      timestamp: "15 minutes ago",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      type: "fee_updated",
      title: "Fee Structure Updated",
      description: "Vault management fees adjusted to 0.5%",
      timestamp: "1 hour ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 4,
      type: "alert_resolved",
      title: "High Risk Alert Resolved",
      description: "Wine collection asset risk assessment completed",
      timestamp: "2 hours ago",
      icon: Shield,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const assetBreakdown = [
    { type: "Real Estate", value: 1.8, percentage: 60.6, color: "bg-blue-500" },
    {
      type: "Commodities",
      value: 0.7,
      percentage: 23.6,
      color: "bg-green-500",
    },
    {
      type: "Collectibles",
      value: 0.3,
      percentage: 10.1,
      color: "bg-purple-500",
    },
    { type: "Vehicles", value: 0.17, percentage: 5.7, color: "bg-orange-500" },
  ];

  const networkStatus = [
    {
      name: "Ethereum",
      status: "healthy",
      latency: "12ms",
      color: "bg-green-500",
    },
    {
      name: "Polygon",
      status: "healthy",
      latency: "8ms",
      color: "bg-green-500",
    },
    {
      name: "Arbitrum",
      status: "healthy",
      latency: "15ms",
      color: "bg-green-500",
    },
    {
      name: "Optimism",
      status: "warning",
      latency: "45ms",
      color: "bg-yellow-500",
    },
    { name: "Base", status: "healthy", latency: "10ms", color: "bg-green-500" },
  ];

  const timeframes = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time platform analytics and system monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant={
                selectedTimeframe === timeframe.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={
                selectedTimeframe === timeframe.value
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : ""
              }
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Value Locked
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  ${platformMetrics.totalValueLocked.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {platformMetrics.totalValueLocked.change}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Assets
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {platformMetrics.totalAssets.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {platformMetrics.totalAssets.change} this week
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {platformMetrics.activeUsers.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {platformMetrics.activeUsers.change} this month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Pending Approvals
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {platformMetrics.pendingApprovals.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {platformMetrics.pendingApprovals.change} resolved
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Asset Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Asset Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetBreakdown.map((asset, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {asset.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${asset.value}B ({asset.percentage}%)
                    </span>
                  </div>
                  <Progress value={asset.percentage} className="h-2">
                    <div
                      className={`h-full rounded-full ${asset.color}`}
                      style={{ width: `${asset.percentage}%` }}
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {networkStatus.map((network, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${network.color}`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {network.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          network.status === "healthy"
                            ? "border-green-200 text-green-700"
                            : "border-yellow-200 text-yellow-700"
                        }
                      >
                        {network.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Latency: {network.latency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and System Health */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Platform Uptime
                </span>
                <span className="text-sm font-bold text-green-600">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "99.9%" }}
                />
              </Progress>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  API Response Time
                </span>
                <span className="text-sm font-bold text-blue-600">120ms</span>
              </div>
              <Progress value={75} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "75%" }}
                />
              </Progress>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Database Health
                </span>
                <span className="text-sm font-bold text-green-600">
                  Excellent
                </span>
              </div>
              <Progress value={95} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "95%" }}
                />
              </Progress>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
