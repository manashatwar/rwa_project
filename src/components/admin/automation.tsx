"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Play,
  Pause,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
} from "lucide-react";

interface AutomationSectionProps {
  onBack: () => void;
}

export default function AutomationSection({ onBack }: AutomationSectionProps) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const automationRules = [
    {
      id: "price-alert",
      name: "Asset Price Monitoring",
      description: "Monitor asset price changes and send alerts",
      trigger: "Asset price change > 10%",
      action: "Send email notification to admin",
      status: "active",
      lastTriggered: "2 hours ago",
      triggerCount: 15,
      type: "monitoring",
    },
    {
      id: "approval-workflow",
      name: "Asset Approval Workflow",
      description: "Automate asset approval process based on criteria",
      trigger: "New asset submission",
      action: "Auto-approve if criteria met, else route to manual review",
      status: "active",
      lastTriggered: "1 day ago",
      triggerCount: 8,
      type: "workflow",
    },
    {
      id: "fee-collection",
      name: "Automated Fee Collection",
      description: "Collect management fees from vaults automatically",
      trigger: "Monthly schedule (1st of month)",
      action: "Collect fees from all active vaults",
      status: "active",
      lastTriggered: "15 days ago",
      triggerCount: 3,
      type: "finance",
    },
    {
      id: "risk-monitoring",
      name: "Risk Threshold Monitoring",
      description: "Monitor vault risk levels and trigger alerts",
      trigger: "Vault risk score > 4.0",
      action: "Send high-priority alert to risk team",
      status: "active",
      lastTriggered: "Never",
      triggerCount: 0,
      type: "risk",
    },
    {
      id: "user-onboarding",
      name: "User Onboarding Automation",
      description: "Automate welcome emails and setup guides",
      trigger: "New user registration",
      action: "Send welcome email series and setup guides",
      status: "paused",
      lastTriggered: "3 hours ago",
      triggerCount: 42,
      type: "marketing",
    },
  ];

  const notificationChannels = [
    {
      id: "email",
      name: "Email Notifications",
      description: "Send alerts via email",
      icon: Mail,
      enabled: true,
      recipients: ["admin@tangiblefi.com", "security@tangiblefi.com"],
    },
    {
      id: "slack",
      name: "Slack Integration",
      description: "Post alerts to Slack channels",
      icon: MessageSquare,
      enabled: true,
      recipients: ["#admin-alerts", "#security-team"],
    },
    {
      id: "webhook",
      name: "Webhook Notifications",
      description: "Send alerts to external webhooks",
      icon: Zap,
      enabled: false,
      recipients: ["https://api.external.com/webhooks/alerts"],
    },
  ];

  const recentActivity = [
    {
      id: 1,
      rule: "Asset Price Monitoring",
      message: "Tesla Model S collection price increased by 12.5%",
      timestamp: "2 hours ago",
      type: "alert",
      status: "sent",
    },
    {
      id: 2,
      rule: "Automated Fee Collection",
      message: "Monthly fees collected from 89 vaults ($14.8K total)",
      timestamp: "15 days ago",
      type: "finance",
      status: "completed",
    },
    {
      id: 3,
      rule: "Asset Approval Workflow",
      message: "Manhattan property auto-approved (met all criteria)",
      timestamp: "1 day ago",
      type: "workflow",
      status: "completed",
    },
    {
      id: 4,
      rule: "User Onboarding Automation",
      message: "Welcome email sent to new user (0x742d...1234)",
      timestamp: "3 hours ago",
      type: "marketing",
      status: "sent",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monitoring":
        return "bg-blue-100 text-blue-700";
      case "workflow":
        return "bg-green-100 text-green-700";
      case "finance":
        return "bg-yellow-100 text-yellow-700";
      case "risk":
        return "bg-red-100 text-red-700";
      case "marketing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleRule = (ruleId: string) => {
    // Toggle automation rule logic
    alert(`Automation rule "${ruleId}" toggled!`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Automation & Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            Manage automation rules, triggers, and notification systems
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="w-4 h-4 mr-2" />
          Create New Rule
        </Button>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Active Rules
                </p>
                <p className="text-3xl font-bold text-blue-900">4</p>
                <p className="text-sm text-blue-600 mt-1">Running</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Triggers
                </p>
                <p className="text-3xl font-bold text-green-900">68</p>
                <p className="text-sm text-green-600 mt-1">This month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Notifications Sent
                </p>
                <p className="text-3xl font-bold text-purple-900">142</p>
                <p className="text-sm text-purple-600 mt-1">This week</p>
              </div>
              <Bell className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-orange-900">98.2%</p>
                <p className="text-sm text-orange-600 mt-1">Reliability</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Automation Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedRule === rule.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRule(rule.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">
                        {rule.name}
                      </h4>
                      <Badge className={getTypeColor(rule.type)}>
                        {rule.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`border-0 ${getStatusColor(rule.status)}`}
                      >
                        {rule.status}
                      </Badge>
                      <Switch
                        checked={rule.status === "active"}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {rule.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Trigger:</span>
                      <p className="font-medium">{rule.trigger}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Action:</span>
                      <p className="font-medium">{rule.action}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last triggered:</span>
                      <p className="font-medium">{rule.lastTriggered}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total triggers:</span>
                      <p className="font-medium">{rule.triggerCount}</p>
                    </div>
                  </div>

                  {selectedRule === rule.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          Test Run
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          View Logs
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationChannels.map((channel) => (
              <div
                key={channel.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <channel.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {channel.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {channel.description}
                      </p>
                    </div>
                  </div>
                  <Switch checked={channel.enabled} />
                </div>

                <div className="mt-3">
                  <span className="text-sm text-gray-500">Recipients:</span>
                  <div className="mt-1 space-y-1">
                    {channel.recipients.map((recipient, index) => (
                      <p
                        key={index}
                        className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded"
                      >
                        {recipient}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Recent Automation Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "alert"
                        ? "bg-red-500"
                        : activity.type === "finance"
                          ? "bg-yellow-500"
                          : activity.type === "workflow"
                            ? "bg-green-500"
                            : "bg-purple-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {activity.rule}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${getStatusColor(activity.status)} border-0`}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Create New Automation Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name
                </label>
                <Input placeholder="Enter rule name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe what this rule does"
                  className="h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Condition
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Asset price change</option>
                  <option>New user registration</option>
                  <option>Vault risk threshold</option>
                  <option>Scheduled trigger</option>
                  <option>Custom webhook</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action to Take
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Send email notification</option>
                  <option>Post to Slack</option>
                  <option>Call webhook</option>
                  <option>Execute smart contract</option>
                  <option>Create task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Recipients
                </label>
                <Textarea
                  placeholder="Enter email addresses or webhook URLs"
                  className="h-20"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch />
                  <span className="text-sm text-gray-700">
                    Enable immediately
                  </span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Rule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
