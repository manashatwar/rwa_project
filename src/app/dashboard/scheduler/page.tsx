"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  DollarSign,
  Bell,
  CheckCircle,
  Zap,
  Shield,
  Repeat,
  Target,
  TrendingUp,
  AlertCircle,
  Settings,
} from "lucide-react";

export default function SchedulerPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  const features = [
    {
      icon: Repeat,
      title: "Automated Payments",
      description:
        "Set up recurring loan payments, asset management fees, and portfolio rebalancing",
      status: "In Development",
      color: "blue",
    },
    {
      icon: Target,
      title: "Smart Scheduling",
      description:
        "AI-powered optimization for payment timing based on cash flow and market conditions",
      status: "Planned",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Payment Security",
      description:
        "Multi-factor authentication and approval workflows for scheduled transactions",
      status: "In Development",
      color: "green",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get alerts before payments, payment confirmations, and failure notifications",
      status: "Coming Soon",
      color: "orange",
    },
    {
      icon: TrendingUp,
      title: "Cash Flow Management",
      description:
        "Optimize payment schedules based on your portfolio performance and liquidity",
      status: "Planned",
      color: "indigo",
    },
    {
      icon: Settings,
      title: "Flexible Rules",
      description:
        "Create complex payment rules with conditions, limits, and approval requirements",
      status: "Coming Soon",
      color: "red",
    },
  ];

  const useCases = [
    {
      title: "Loan EMI Automation",
      description: "Never miss a loan payment with automated EMI scheduling",
      icon: DollarSign,
      example: "Auto-pay $5,000 every 30 days for equipment loan",
    },
    {
      title: "Portfolio Rebalancing",
      description: "Automatically maintain your desired asset allocation",
      icon: Target,
      example:
        "Rebalance monthly to maintain 60/40 real estate/commodity split",
    },
    {
      title: "Interest Payments",
      description: "Schedule regular interest payments to asset token holders",
      icon: Repeat,
      example: "Pay 8% APY quarterly to Manhattan Apartment token holders",
    },
    {
      title: "Fee Management",
      description: "Automate platform fees and asset management charges",
      icon: Settings,
      example: "Pay 2% annual management fee for tokenized assets",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-orange-100 text-orange-800 text-sm">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900">Payment Scheduler</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Automate your payments, optimize cash flow, and never miss important
          transactions with our intelligent payment scheduling system.
        </p>
      </div>

      {/* Main Coming Soon Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Smart Payment Automation Coming Soon
          </h2>

          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Our advanced payment scheduler will handle all your recurring
            transactions, optimize payment timing, and ensure you never miss
            important payments.
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
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                You'll be notified when Payment Scheduler is available!
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expected Q3 2024
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Powered
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Powerful Automation Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent
                        className={`w-5 h-5 text-${feature.color}-600`}
                      />
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

      {/* Use Cases */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How You'll Use It
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {useCase.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {useCase.description}
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Example:</p>
                        <p className="text-sm font-medium text-gray-800">
                          {useCase.example}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "Loan Payment",
                amount: "$5,000",
                frequency: "Monthly",
                nextDate: "Jan 15, 2024",
                status: "scheduled",
              },
              {
                type: "Interest Distribution",
                amount: "$2,500",
                frequency: "Quarterly",
                nextDate: "Jan 31, 2024",
                status: "pending",
              },
              {
                type: "Management Fee",
                amount: "$750",
                frequency: "Monthly",
                nextDate: "Feb 1, 2024",
                status: "scheduled",
              },
              {
                type: "Portfolio Rebalance",
                amount: "Variable",
                frequency: "Monthly",
                nextDate: "Feb 15, 2024",
                status: "conditional",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.type}</h4>
                    <p className="text-sm text-gray-500">
                      {item.amount} • {item.frequency}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {item.nextDate}
                  </p>
                  <Badge
                    className={`text-xs ${
                      item.status === "scheduled"
                        ? "bg-green-100 text-green-800"
                        : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Why Use Payment Scheduler?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Never Miss Payments
              </h4>
              <p className="text-sm text-gray-600">
                Automated scheduling ensures all your payments happen on time,
                every time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Optimize Cash Flow
              </h4>
              <p className="text-sm text-gray-600">
                AI-powered timing optimization to maximize your liquidity and
                returns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">
                Set it once and forget it. Focus on growing your portfolio, not
                managing payments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gray-50">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Be Among the First to Automate Your Payments
          </h3>
          <p className="text-gray-600 mb-6">
            Join our early access program and get priority access to Payment
            Scheduler beta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Learn More About Automation
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Join Beta Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
