"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import UI components
const Card = dynamic(
  () => import("@/components/ui/card").then((mod) => ({ default: mod.Card })),
  { ssr: false }
);
const CardContent = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({
      default: mod.CardContent,
    })),
  { ssr: false }
);
const CardHeader = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({ default: mod.CardHeader })),
  { ssr: false }
);
const CardTitle = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({ default: mod.CardTitle })),
  { ssr: false }
);
const Button = dynamic(
  () =>
    import("@/components/ui/button").then((mod) => ({ default: mod.Button })),
  { ssr: false }
);
const Input = dynamic(() => import("@/components/ui/input"), { ssr: false });
const Textarea = dynamic(() => import("@/components/ui/textarea"), {
  ssr: false,
});
const Label = dynamic(() => import("@/components/ui/label"), { ssr: false });
const Badge = dynamic(
  () => import("@/components/ui/badge").then((mod) => ({ default: mod.Badge })),
  { ssr: false }
);
const Tabs = dynamic(
  () => import("@/components/ui/tabs").then((mod) => ({ default: mod.Tabs })),
  { ssr: false }
);
const TabsContent = dynamic(
  () =>
    import("@/components/ui/tabs").then((mod) => ({
      default: mod.TabsContent,
    })),
  { ssr: false }
);
const TabsList = dynamic(
  () =>
    import("@/components/ui/tabs").then((mod) => ({ default: mod.TabsList })),
  { ssr: false }
);
const TabsTrigger = dynamic(
  () =>
    import("@/components/ui/tabs").then((mod) => ({
      default: mod.TabsTrigger,
    })),
  { ssr: false }
);
const Select = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => ({ default: mod.Select })),
  { ssr: false }
);
const SelectContent = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => ({
      default: mod.SelectContent,
    })),
  { ssr: false }
);
const SelectItem = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => ({
      default: mod.SelectItem,
    })),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => ({
      default: mod.SelectTrigger,
    })),
  { ssr: false }
);
const SelectValue = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => ({
      default: mod.SelectValue,
    })),
  { ssr: false }
);

// Dynamically import icons
const Icons = {
  HelpCircle: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.HelpCircle })),
    { ssr: false }
  ),
  Search: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Search })),
    { ssr: false }
  ),
  MessageSquare: dynamic(
    () =>
      import("lucide-react").then((mod) => ({ default: mod.MessageSquare })),
    { ssr: false }
  ),
  Mail: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Mail })),
    { ssr: false }
  ),
  Phone: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Phone })),
    { ssr: false }
  ),
  Clock: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
    { ssr: false }
  ),
  CheckCircle: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
    { ssr: false }
  ),
  AlertCircle: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.AlertCircle })),
    { ssr: false }
  ),
  Users: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Users })),
    { ssr: false }
  ),
  BookOpen: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.BookOpen })),
    { ssr: false }
  ),
  FileText: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.FileText })),
    { ssr: false }
  ),
  Settings: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Settings })),
    { ssr: false }
  ),
  Zap: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
    { ssr: false }
  ),
  Shield: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Shield })),
    { ssr: false }
  ),
  CreditCard: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.CreditCard })),
    { ssr: false }
  ),
  Wallet: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Wallet })),
    { ssr: false }
  ),
  ChevronDown: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.ChevronDown })),
    { ssr: false }
  ),
  ChevronUp: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.ChevronUp })),
    { ssr: false }
  ),
  ExternalLink: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.ExternalLink })),
    { ssr: false }
  ),
  Send: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Send })),
    { ssr: false }
  ),
  Star: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Star })),
    { ssr: false }
  ),
  Home: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Home })),
    { ssr: false }
  ),
  Github: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Github })),
    { ssr: false }
  ),
  Twitter: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Twitter })),
    { ssr: false }
  ),
  Youtube: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Youtube })),
    { ssr: false }
  ),
  Building2: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Building2 })),
    { ssr: false }
  ),
  Target: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Target })),
    { ssr: false }
  ),
  ArrowLeftRight: dynamic(
    () =>
      import("lucide-react").then((mod) => ({ default: mod.ArrowLeftRight })),
    { ssr: false }
  ),
  Headphones: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Headphones })),
    { ssr: false }
  ),
  Video: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Video })),
    { ssr: false }
  ),
  Calendar: dynamic(
    () => import("lucide-react").then((mod) => ({ default: mod.Calendar })),
    { ssr: false }
  ),
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    category: "",
    priority: "",
    subject: "",
    description: "",
  });

  const supportStats = [
    {
      label: "Average Response Time",
      value: "< 2 hours",
      icon: Icons.Clock,
      color: "blue",
    },
    {
      label: "Resolution Rate",
      value: "98.5%",
      icon: Icons.CheckCircle,
      color: "green",
    },
    {
      label: "Customer Satisfaction",
      value: "4.9/5",
      icon: Icons.Star,
      color: "yellow",
    },
    {
      label: "24/7 Support",
      value: "Available",
      icon: Icons.Headphones,
      color: "purple",
    },
  ];

  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: Icons.Zap,
      count: 12,
      color: "blue",
    },
    {
      id: "account",
      name: "Account & Security",
      icon: Icons.Shield,
      count: 18,
      color: "emerald",
    },
    {
      id: "assets",
      name: "Asset Management",
      icon: Icons.Building2,
      count: 15,
      color: "orange",
    },
    {
      id: "loans",
      name: "Loans & Lending",
      icon: Icons.CreditCard,
      count: 22,
      color: "purple",
    },
    {
      id: "wallet",
      name: "Wallet & Payments",
      icon: Icons.Wallet,
      count: 14,
      color: "cyan",
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: Icons.Settings,
      count: 16,
      color: "red",
    },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I get started with TangibleFi?",
      answer:
        "To get started with TangibleFi, first create an account and complete the KYC verification process. Then connect your Web3 wallet, add your first asset, and you can begin using our lending and tokenization services.",
      popularity: "high",
    },
    {
      id: 2,
      category: "account",
      question: "How do I complete KYC verification?",
      answer:
        "KYC verification requires uploading a government-issued ID, proof of address, and completing identity verification. The process typically takes 24-48 hours for review and approval.",
      popularity: "high",
    },
    {
      id: 3,
      category: "assets",
      question: "What types of assets can I tokenize?",
      answer:
        "You can tokenize various real-world assets including real estate, luxury vehicles, art collections, equipment, and other valuable physical assets. Each asset must meet our minimum value and verification requirements.",
      popularity: "high",
    },
    {
      id: 4,
      category: "loans",
      question: "What are the loan-to-value (LTV) ratios?",
      answer:
        "LTV ratios vary by asset type. Real estate typically offers up to 80% LTV, luxury vehicles up to 75%, and art/collectibles up to 70%. Higher credit scores may qualify for better rates.",
      popularity: "medium",
    },
    {
      id: 5,
      category: "wallet",
      question: "Which wallets are supported?",
      answer:
        "We support MetaMask, WalletConnect, Coinbase Wallet, and other popular Web3 wallets. Make sure your wallet is connected to the correct network (Ethereum, Polygon, etc.).",
      popularity: "medium",
    },
    {
      id: 6,
      category: "technical",
      question: "Why is my transaction taking so long?",
      answer:
        "Transaction delays can occur due to network congestion or low gas fees. You can speed up transactions by increasing the gas fee or wait for network congestion to reduce.",
      popularity: "high",
    },
    {
      id: 7,
      category: "loans",
      question: "How are interest rates determined?",
      answer:
        "Interest rates are based on several factors including asset type, LTV ratio, loan duration, your credit score, and current market conditions. Rates typically range from 4.25% to 12% APR.",
      popularity: "medium",
    },
    {
      id: 8,
      category: "assets",
      question: "How long does asset verification take?",
      answer:
        "Asset verification typically takes 3-7 business days depending on the asset type and complexity. Real estate may take longer due to title verification requirements.",
      popularity: "medium",
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      icon: Icons.MessageSquare,
      availability: "24/7",
      responseTime: "< 5 minutes",
      action: "Start Chat",
      color: "blue",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Icons.Mail,
      availability: "24/7",
      responseTime: "< 2 hours",
      action: "Send Email",
      color: "emerald",
    },
    {
      title: "Video Call Support",
      description: "Schedule a one-on-one video consultation",
      icon: Icons.Video,
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Same day",
      action: "Schedule Call",
      color: "purple",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      icon: Icons.Phone,
      availability: "Mon-Fri 8AM-8PM EST",
      responseTime: "Immediate",
      action: "Call Now",
      color: "orange",
    },
  ];

  const troubleshootingGuides = [
    {
      title: "Wallet Connection Issues",
      description: "Resolve common wallet connection problems",
      steps: 5,
      difficulty: "Easy",
      timeToComplete: "5 minutes",
      icon: Icons.Wallet,
    },
    {
      title: "Transaction Failed",
      description: "Fix failed or stuck transactions",
      steps: 7,
      difficulty: "Medium",
      timeToComplete: "10 minutes",
      icon: Icons.AlertCircle,
    },
    {
      title: "Asset Verification Rejected",
      description: "Common reasons and how to resubmit",
      steps: 4,
      difficulty: "Easy",
      timeToComplete: "15 minutes",
      icon: Icons.Building2,
    },
    {
      title: "KYC Verification Help",
      description: "Complete your identity verification successfully",
      steps: 6,
      difficulty: "Easy",
      timeToComplete: "20 minutes",
      icon: Icons.Shield,
    },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSupportFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Support form submitted:", supportForm);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icons.HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Help & Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get the help you need with our comprehensive support resources,
            FAQs, and expert assistance
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
          </div>

          {/* Support Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {supportStats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="flex-1">
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
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="flex items-center justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <Icons.HelpCircle className="w-4 h-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Icons.MessageSquare className="w-4 h-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <Icons.BookOpen className="w-4 h-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Icons.FileText className="w-4 h-4" />
                Tickets
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="faq" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* FAQ Categories */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.Target className="w-5 h-5 text-blue-600" />
                      FAQ Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faqCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                          >
                            <category.icon
                              className={`w-5 h-5 text-${category.color}-600`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {category.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {category.count} articles
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* FAQ List */}
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.HelpCircle className="w-5 h-5 text-blue-600" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={`${
                                  faq.popularity === "high"
                                    ? "bg-red-100 text-red-800"
                                    : faq.popularity === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                } text-xs`}
                              >
                                {faq.popularity === "high"
                                  ? "Popular"
                                  : faq.popularity === "medium"
                                    ? "Common"
                                    : "Basic"}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedFaq === faq.id ? (
                            <Icons.ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Icons.ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>

                        {expandedFaq === faq.id && (
                          <div className="px-6 pb-6 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                Was this helpful?
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Icons.MessageSquare className="w-3 h-3 mr-1" />
                                Need more help?
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Options */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Options
                </h2>
                {contactOptions.map((option, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 bg-${option.color}-100 rounded-lg flex items-center justify-center`}
                        >
                          <option.icon
                            className={`w-6 h-6 text-${option.color}-600`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {option.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {option.description}
                          </p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Icons.Clock className="w-4 h-4" />
                              {option.availability}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Icons.Zap className="w-4 h-4" />
                              Response: {option.responseTime}
                            </div>
                          </div>
                          <Button
                            className={`bg-${option.color}-600 hover:bg-${option.color}-700 text-white w-full`}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Support Form */}
              <div>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.Send className="w-5 h-5 text-blue-600" />
                      Submit Support Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSupportFormSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={supportForm.name}
                            onChange={(e) =>
                              setSupportForm({
                                ...supportForm,
                                name: e.target.value,
                              })
                            }
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={supportForm.email}
                            onChange={(e) =>
                              setSupportForm({
                                ...supportForm,
                                email: e.target.value,
                              })
                            }
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={supportForm.category}
                            onValueChange={(value) =>
                              setSupportForm({
                                ...supportForm,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="account">
                                Account & Security
                              </SelectItem>
                              <SelectItem value="assets">
                                Asset Management
                              </SelectItem>
                              <SelectItem value="loans">
                                Loans & Lending
                              </SelectItem>
                              <SelectItem value="wallet">
                                Wallet & Payments
                              </SelectItem>
                              <SelectItem value="technical">
                                Technical Issues
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={supportForm.priority}
                            onValueChange={(value) =>
                              setSupportForm({
                                ...supportForm,
                                priority: value,
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={supportForm.subject}
                          onChange={(e) =>
                            setSupportForm({
                              ...supportForm,
                              subject: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">
                          Detailed Description
                        </Label>
                        <Textarea
                          id="description"
                          value={supportForm.description}
                          onChange={(e) =>
                            setSupportForm({
                              ...supportForm,
                              description: e.target.value,
                            })
                          }
                          className="mt-1 min-h-[120px]"
                          placeholder="Provide detailed information about your issue, including steps to reproduce if applicable"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Icons.Send className="w-4 h-4 mr-2" />
                        Submit Support Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {troubleshootingGuides.map((guide, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <guide.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {guide.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Icons.FileText className="w-3 h-3" />
                            {guide.steps} steps
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Clock className="w-3 h-3" />
                            {guide.timeToComplete}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {guide.difficulty}
                          </Badge>
                        </div>

                        <Button variant="outline" className="w-full">
                          View Guide
                          <Icons.ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.FileText className="w-5 h-5 text-blue-600" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icons.FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Support Tickets
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any support tickets yet. Create one if you
                    need help.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Icons.Send className="w-4 h-4 mr-2" />
                    Create New Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Still need help?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our team is here to help you succeed. Choose the best way to get
                in touch with us.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Icons.MessageSquare className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  <Icons.Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-700"
                >
                  <Icons.Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600"
                  asChild
                >
                  <a
                    href="https://discord.gg/tangiblefi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.MessageSquare className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600"
                  asChild
                >
                  <a
                    href="https://twitter.com/tangiblefi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600"
                  asChild
                >
                  <a
                    href="https://github.com/tangiblefi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600"
                  asChild
                >
                  <a
                    href="https://youtube.com/@tangiblefi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.Youtube className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Icons.Home className="w-4 h-4" />
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
  );
}
