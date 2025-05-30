"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Code,
  Zap,
  Lock,
  Globe,
  Clock,
  Bell,
  CheckCircle,
  ArrowRight,
  Terminal,
  Key,
  Webhook,
} from "lucide-react";

export default function APIPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  const features = [
    {
      icon: Database,
      title: "Portfolio Data API",
      description:
        "Access your portfolio data, transactions, and asset information programmatically",
      status: "In Development",
    },
    {
      icon: Zap,
      title: "Real-time WebSockets",
      description:
        "Get real-time updates on asset prices, portfolio changes, and market events",
      status: "Planned",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "OAuth 2.0 and API key authentication with granular permission controls",
      status: "In Development",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description:
        "Receive notifications for important events like transactions and price alerts",
      status: "Planned",
    },
    {
      icon: Terminal,
      title: "Trading API",
      description:
        "Execute trades, manage loans, and interact with smart contracts programmatically",
      status: "Coming Soon",
    },
    {
      icon: Globe,
      title: "SDKs & Libraries",
      description:
        "Official SDKs for Python, JavaScript, Go, and other popular languages",
      status: "Planned",
    },
  ];

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/portfolio",
      description: "Get portfolio overview",
    },
    {
      method: "GET",
      path: "/api/v1/assets",
      description: "List all tokenized assets",
    },
    {
      method: "GET",
      path: "/api/v1/transactions",
      description: "Get transaction history",
    },
    {
      method: "POST",
      path: "/api/v1/loans",
      description: "Create a new loan application",
    },
    {
      method: "GET",
      path: "/api/v1/market/prices",
      description: "Get real-time asset prices",
    },
    {
      method: "POST",
      path: "/api/v1/webhooks",
      description: "Register webhook endpoints",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-orange-100 text-orange-800 text-sm">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900">API Access</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build powerful integrations with TangibleFi's RESTful API. Access
          portfolio data, execute trades, and integrate real-world assets into
          your applications.
        </p>
      </div>

      {/* Main Coming Soon Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Developer API Coming Soon
          </h2>

          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            We're building a comprehensive API that will give developers full
            access to TangibleFi's platform. Get notified when it's ready for
            early access testing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            {!subscribed ? (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleNotifyMe}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                You'll be notified when API access is available!
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expected Q2 2024
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Free during beta
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What You'll Be Able To Do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {feature.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* API Endpoint Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Endpoint Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    className={`${
                      endpoint.method === "GET"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    } font-mono text-xs`}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono text-gray-700">
                    {endpoint.path}
                  </code>
                </div>
                <span className="text-sm text-gray-600">
                  {endpoint.description}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Example Response</h4>
            <pre className="text-sm text-blue-800 font-mono overflow-x-auto">
              {`{
  "portfolio": {
    "totalValue": 1250000,
    "totalGain": 125000,
    "assets": [
      {
        "id": "asset_001",
        "name": "Manhattan Apartment",
        "type": "real_estate",
        "value": 750000,
        "tokenized": true
      }
    ]
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Early Access Benefits */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Early Access Benefits
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Free API Access
              </h4>
              <p className="text-sm text-gray-600">
                No charges during the beta period. Higher rate limits for early
                adopters.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Priority Support
              </h4>
              <p className="text-sm text-gray-600">
                Direct access to our engineering team and dedicated developer
                support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Shape the API
              </h4>
              <p className="text-sm text-gray-600">
                Your feedback will directly influence API design and feature
                development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gray-50">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Stay Updated on API Development
          </h3>
          <p className="text-gray-600 mb-6">
            Follow our progress and get the latest updates on API development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              View Documentation Draft
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Join Developer Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
