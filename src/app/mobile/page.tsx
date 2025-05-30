"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Bell,
  CheckCircle,
  Download,
  QrCode,
  Fingerprint,
  Zap,
  Shield,
  TrendingUp,
  Wallet,
  Camera,
  Globe,
  Star,
  Apple,
  Play,
} from "lucide-react";

export default function MobileAppPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  const features = [
    {
      icon: Fingerprint,
      title: "Biometric Security",
      description:
        "Secure login with fingerprint, Face ID, and voice recognition",
      status: "In Development",
    },
    {
      icon: Camera,
      title: "Asset Photography",
      description:
        "Document and verify your real-world assets with AI-powered photo verification",
      status: "Coming Soon",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description:
        "Get instant alerts for price changes, payments, and important account updates",
      status: "In Development",
    },
    {
      icon: QrCode,
      title: "QR Code Transactions",
      description:
        "Quick payments and transfers using QR codes for seamless mobile transactions",
      status: "Planned",
    },
    {
      icon: TrendingUp,
      title: "Portfolio Insights",
      description:
        "AI-powered insights and recommendations optimized for mobile viewing",
      status: "Coming Soon",
    },
    {
      icon: Globe,
      title: "Offline Mode",
      description:
        "Access portfolio data and basic features even without internet connection",
      status: "Planned",
    },
  ];

  const mockScreens = [
    {
      title: "Portfolio Dashboard",
      description:
        "Quick overview of your assets, loans, and performance metrics",
      features: [
        "Total portfolio value",
        "Recent transactions",
        "Price alerts",
        "Quick actions",
      ],
    },
    {
      title: "Asset Management",
      description: "Manage your tokenized assets on the go",
      features: [
        "Asset details",
        "Performance charts",
        "Document upload",
        "Share management",
      ],
    },
    {
      title: "Trading & Loans",
      description: "Execute trades and manage loans from anywhere",
      features: [
        "Loan applications",
        "Payment schedules",
        "Market orders",
        "Transaction history",
      ],
    },
    {
      title: "Security Center",
      description: "Advanced security features designed for mobile",
      features: [
        "Biometric login",
        "Device management",
        "Security alerts",
        "2FA setup",
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-orange-100 text-orange-800 text-sm">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900">
          TangibleFi Mobile App
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your real-world assets, execute trades, and monitor your
          portfolio from anywhere with our powerful mobile application.
        </p>
      </div>

      {/* Main Coming Soon Card */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mobile App Coming to iOS & Android
          </h2>

          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Get early access to our mobile app and be among the first to
            experience real-world asset management on your smartphone.
          </p>

          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {!subscribed ? (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button
                  onClick={handleNotifyMe}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Bell className="w-4 h-4" />
                  Get Early Access
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                You'll get early access when the mobile app launches!
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              iOS & iPadOS
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Android
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bank-grade Security
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Store Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">Tf</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">TangibleFi</h3>
                <p className="text-gray-300">Real World Assets</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-300">4.9 • Finance</span>
            </div>

            <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Get on App Store
            </Button>

            <div className="text-xs text-gray-400">
              <p>Available on iOS 15.0 or later</p>
              <p>Compatible with iPhone, iPad, and iPod touch</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">Tf</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">TangibleFi</h3>
                <p className="text-green-100">Real World Assets</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-green-100">4.9 • Finance</span>
            </div>

            <Button className="w-full mb-4 bg-white text-green-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Get on Google Play
            </Button>

            <div className="text-xs text-green-100">
              <p>Available on Android 8.0 or later</p>
              <p>Optimized for phones and tablets</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Mobile-First Features
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

      {/* Screen Previews */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          App Screen Previews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockScreens.map((screen, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 mb-4 h-64 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-4 w-48 h-80 max-w-full max-h-full flex flex-col">
                    <div className="bg-blue-600 rounded-t-lg h-16 flex items-center justify-center mb-2">
                      <span className="text-white font-semibold text-xs">
                        {screen.title}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {screen.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="bg-gray-100 rounded p-2"
                        >
                          <div className="text-xs text-gray-600">{feature}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {screen.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {screen.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {screen.features.map((feature, featureIndex) => (
                    <Badge
                      key={featureIndex}
                      variant="outline"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Technical Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                iOS Requirements
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• iOS 15.0 or later</li>
                <li>• iPhone 8 or newer</li>
                <li>• iPad (6th generation) or newer</li>
                <li>• iPod touch (7th generation)</li>
                <li>• Apple Watch compatibility</li>
                <li>• Face ID / Touch ID support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Android Requirements
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Android 8.0 (API level 26) or later</li>
                <li>• 2GB RAM minimum, 4GB recommended</li>
                <li>• 100MB free storage space</li>
                <li>• Fingerprint sensor support</li>
                <li>• Camera for document scanning</li>
                <li>• Wear OS compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Why Use the Mobile App?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Instant Access
              </h4>
              <p className="text-sm text-gray-600">
                Manage your portfolio and execute trades from anywhere, anytime.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Enhanced Security
              </h4>
              <p className="text-sm text-gray-600">
                Biometric authentication and device-specific security features.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Real-time Alerts
              </h4>
              <p className="text-sm text-gray-600">
                Get instant notifications for important account and market
                updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beta Program */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Join the Beta Testing Program
            </h3>
            <p className="text-gray-600 mb-6">
              Get exclusive early access to the mobile app and help shape its
              development.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold text-sm">1</span>
                </div>
                <p className="text-sm font-medium">Sign up for early access</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold text-sm">2</span>
                </div>
                <p className="text-sm font-medium">
                  Receive TestFlight/Beta invitation
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold text-sm">3</span>
                </div>
                <p className="text-sm font-medium">Test and provide feedback</p>
              </div>
            </div>

            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Smartphone className="w-4 h-4 mr-2" />
              Join Beta Program
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gray-50">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Stay Updated on Mobile App Development
          </h3>
          <p className="text-gray-600 mb-6">
            Follow our progress and be the first to know when the app launches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Get Launch Notifications
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
