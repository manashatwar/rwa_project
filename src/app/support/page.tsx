"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Star,
  Home,
  Send,
} from "lucide-react";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Help & Support Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get the help you need with our comprehensive support resources and
              expert assistance
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help articles and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          </div>

          {/* Support Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Response Time", value: "< 2 hours", icon: Clock },
              { label: "Resolution Rate", value: "98.5%", icon: CheckCircle },
              { label: "Satisfaction", value: "4.9/5", icon: Star },
              { label: "24/7 Support", value: "Available", icon: Phone },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="flex items-center justify-center">
              <TabsList className="grid w-full max-w-lg grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger
                  value="tickets"
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Tickets
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="faq" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      question: "How do I get started with TangibleFi?",
                      answer:
                        "Create an account, complete KYC verification, connect your wallet, and add your first asset to begin tokenizing and lending.",
                    },
                    {
                      question: "What types of assets can I tokenize?",
                      answer:
                        "Real estate, luxury vehicles, art collections, equipment, and other valuable physical assets that meet our verification requirements.",
                    },
                    {
                      question: "How are loan rates determined?",
                      answer:
                        "Rates are based on asset type, LTV ratio, loan duration, credit score, and current market conditions, typically ranging from 4.25% to 12% APR.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Contact Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Live Chat",
                        icon: MessageSquare,
                        time: "< 5 min",
                      },
                      { title: "Email Support", icon: Mail, time: "< 2 hours" },
                      {
                        title: "Phone Support",
                        icon: Phone,
                        time: "Immediate",
                      },
                    ].map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <option.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{option.title}</h4>
                          <p className="text-sm text-gray-600">
                            Response: {option.time}
                          </p>
                        </div>
                        <Button>Connect</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Submit Support Request</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input className="mt-1" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input className="mt-1" />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea className="mt-1 min-h-[100px]" />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Support Tickets
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any support tickets yet.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create New Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Need immediate assistance? Our support team is available 24/7 to
              help you.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <Link href="/docs" className="text-blue-600 hover:text-blue-700">
                Documentation
              </Link>
              <Link
                href="/community"
                className="text-blue-600 hover:text-blue-700"
              >
                Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
