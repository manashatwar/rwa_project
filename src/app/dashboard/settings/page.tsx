"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Database,
  Network,
  Smartphone,
  Globe,
  Palette,
  Monitor,
  Lock,
  Key,
  Webhook,
  Zap,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      weeklyReports: true,
      priceAlerts: true,
      securityNotifications: true,
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "UTC",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      numberFormat: "US",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      biometricAuth: false,
      deviceTrust: true,
      auditLog: true,
    },
    trading: {
      confirmations: true,
      slippageTolerance: 0.5,
      gasPrice: "standard",
      autoApproval: false,
      maxTransactionValue: 10000,
    },
    integrations: {
      metamask: true,
      coinbase: false,
      ledger: false,
      trezor: false,
      walletConnect: true,
    },
    api: {
      enabled: false,
      rateLimit: 100,
      webhook: "",
      ipWhitelist: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async (section?: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your platform preferences and configurations
          </p>
        </div>
        <Button onClick={() => handleSave()} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save All"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      updateSetting("appearance", "theme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) =>
                      updateSetting("appearance", "language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) =>
                      updateSetting("appearance", "timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">EST</SelectItem>
                      <SelectItem value="America/Los_Angeles">PST</SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Asia/Tokyo">JST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select
                    value={settings.appearance.currency}
                    onValueChange={(value) =>
                      updateSetting("appearance", "currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={settings.appearance.dateFormat}
                    onValueChange={(value) =>
                      updateSetting("appearance", "dateFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number Format</Label>
                  <Select
                    value={settings.appearance.numberFormat}
                    onValueChange={(value) =>
                      updateSetting("appearance", "numberFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">1,234.56 (US)</SelectItem>
                      <SelectItem value="EU">1.234,56 (EU)</SelectItem>
                      <SelectItem value="IN">1,23,456.78 (Indian)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "emailAlerts",
                  label: "Email Alerts",
                  desc: "Receive important updates via email",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  desc: "Browser and app push notifications",
                },
                {
                  key: "smsAlerts",
                  label: "SMS Alerts",
                  desc: "Critical notifications via text message",
                },
                {
                  key: "weeklyReports",
                  label: "Weekly Reports",
                  desc: "Portfolio performance summaries",
                },
                {
                  key: "priceAlerts",
                  label: "Price Alerts",
                  desc: "Asset price movement notifications",
                },
                {
                  key: "securityNotifications",
                  label: "Security Notifications",
                  desc: "Account security and login alerts",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={
                      settings.notifications[
                        item.key as keyof typeof settings.notifications
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", item.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-500">
                      Add extra security with 2FA
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "twoFactorAuth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Biometric Authentication
                    </h4>
                    <p className="text-sm text-gray-500">
                      Use fingerprint or face recognition
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.biometricAuth}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "biometricAuth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Device Trust</h4>
                    <p className="text-sm text-gray-500">
                      Remember trusted devices
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.deviceTrust}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "deviceTrust", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Audit Log</h4>
                    <p className="text-sm text-gray-500">
                      Track account activities
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.auditLog}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "auditLog", checked)
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-3">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={settings.security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      updateSetting("security", "sessionTimeout", Number(value))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Trading Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Transaction Confirmations
                    </h4>
                    <p className="text-sm text-gray-500">
                      Require confirmation for all transactions
                    </p>
                  </div>
                  <Switch
                    checked={settings.trading.confirmations}
                    onCheckedChange={(checked) =>
                      updateSetting("trading", "confirmations", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Auto Approval (Small Amounts)
                    </h4>
                    <p className="text-sm text-gray-500">
                      Skip confirmation for small transactions
                    </p>
                  </div>
                  <Switch
                    checked={settings.trading.autoApproval}
                    onCheckedChange={(checked) =>
                      updateSetting("trading", "autoApproval", checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Slippage Tolerance (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.trading.slippageTolerance}
                    onChange={(e) =>
                      updateSetting(
                        "trading",
                        "slippageTolerance",
                        Number(e.target.value)
                      )
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Maximum price movement tolerance
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Gas Price Preference</Label>
                  <Select
                    value={settings.trading.gasPrice}
                    onValueChange={(value) =>
                      updateSetting("trading", "gasPrice", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow (Low Cost)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fast">Fast (Higher Cost)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Transaction Value ($)</Label>
                  <Input
                    type="number"
                    value={settings.trading.maxTransactionValue}
                    onChange={(e) =>
                      updateSetting(
                        "trading",
                        "maxTransactionValue",
                        Number(e.target.value)
                      )
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Requires additional confirmation above this amount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Wallet & Exchange Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: "metamask",
                    label: "MetaMask",
                    desc: "Browser wallet integration",
                    status: "connected",
                  },
                  {
                    key: "coinbase",
                    label: "Coinbase Wallet",
                    desc: "Mobile and web wallet",
                    status: "disconnected",
                  },
                  {
                    key: "ledger",
                    label: "Ledger",
                    desc: "Hardware wallet support",
                    status: "disconnected",
                  },
                  {
                    key: "trezor",
                    label: "Trezor",
                    desc: "Hardware wallet support",
                    status: "disconnected",
                  },
                  {
                    key: "walletConnect",
                    label: "WalletConnect",
                    desc: "Mobile wallet protocol",
                    status: "connected",
                  },
                ].map((integration) => (
                  <div
                    key={integration.key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {integration.label}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {integration.desc}
                        </p>
                      </div>
                      <Badge
                        className={
                          integration.status === "connected"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Switch
                        checked={
                          settings.integrations[
                            integration.key as keyof typeof settings.integrations
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          updateSetting(
                            "integrations",
                            integration.key,
                            checked
                          )
                        }
                      />
                      <Button variant="outline" size="sm">
                        {integration.status === "connected"
                          ? "Configure"
                          : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">API Access</h4>
                  <p className="text-sm text-gray-500">
                    Enable programmatic access to your account
                  </p>
                </div>
                <Switch
                  checked={settings.api.enabled}
                  onCheckedChange={(checked) =>
                    updateSetting("api", "enabled", checked)
                  }
                />
              </div>

              {settings.api.enabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rate Limit (requests/hour)</Label>
                      <Input
                        type="number"
                        value={settings.api.rateLimit}
                        onChange={(e) =>
                          updateSetting(
                            "api",
                            "rateLimit",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input
                        type="url"
                        placeholder="https://your-server.com/webhook"
                        value={settings.api.webhook}
                        onChange={(e) =>
                          updateSetting("api", "webhook", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>IP Whitelist (comma-separated)</Label>
                    <Input
                      placeholder="192.168.1.1, 10.0.0.1"
                      value={settings.api.ipWhitelist}
                      onChange={(e) =>
                        updateSetting("api", "ipWhitelist", e.target.value)
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Leave empty to allow all IPs
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Generate API Key
                    </Button>
                    <Button variant="outline">
                      <Webhook className="w-4 h-4 mr-2" />
                      Test Webhook
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-red-900 mb-2">
                  Export Account Data
                </h4>
                <p className="text-red-700 text-sm mb-3">
                  Download all your account data including transactions, assets,
                  and settings.
                </p>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700"
                >
                  Export Data
                </Button>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-red-900 mb-2">
                  Delete Account
                </h4>
                <p className="text-red-700 text-sm mb-3">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
