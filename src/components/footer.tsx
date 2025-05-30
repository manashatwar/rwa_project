import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Github,
  Sparkles,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        {/* Logo and tagline section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-extrabold text-white">Tf</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">TangibleFi</h3>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing asset ownership through blockchain tokenization and
            instant DeFi liquidity access
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Platform Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Platform</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                >
                  Supported Chains
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                >
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Solutions</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                >
                  Asset Tokenization
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                >
                  RWA Lending
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                >
                  Cross-Chain Management
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                >
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Resources</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm"
                >
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Legal</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 mb-4 md:mb-0 text-sm">
              © {currentYear} TangibleFi. All rights reserved.
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Brand statement */}
        <div className="text-center mt-8 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
            TangibleFi is a revolutionary blockchain platform that transforms
            real-world assets into verified NFTs, enabling instant USDC
            liquidity through cutting-edge DeFi protocols across multiple
            blockchain networks. Our platform supports Ethereum, Polygon, BNB
            Chain, and Arbitrum with enterprise-grade security and compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
