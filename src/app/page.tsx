import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BarChart3,
  Coins,
  FileCheck,
  Globe,
  Landmark,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Multi-Chain RWA Lending Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your tokenized real-world assets and lending activities
              across multiple blockchains with our comprehensive dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Portfolio Overview",
                description:
                  "Monitor collateral value, loan balances, and health ratios in real-time",
              },
              {
                icon: <FileCheck className="w-6 h-6" />,
                title: "Asset Management",
                description:
                  "Track and verify tokenized real-world assets with ease",
              },
              {
                icon: <Landmark className="w-6 h-6" />,
                title: "Loan Management",
                description: "Streamlined payment schedules and EMI tracking",
              },
              {
                icon: <Coins className="w-6 h-6" />,
                title: "Multi-Token Payments",
                description: "Process payments in various cryptocurrencies",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Cross-Chain Activity",
                description:
                  "Unified view of positions across multiple blockchains",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Enterprise Security",
                description: "Bank-grade encryption for your digital assets",
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "Collateral Management",
                description: "Optimize your asset collateralization strategy",
              },
              {
                icon: <ArrowUpRight className="w-6 h-6" />,
                title: "Real-Time Analytics",
                description:
                  "Data-driven insights for better financial decisions",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$500M+</div>
              <div className="text-blue-100">Assets Tokenized</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-blue-100">Blockchain Networks</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Loans</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Manage Your RWA Portfolio?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust our platform for their
            tokenized real-world assets and lending activities.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Dashboard
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
