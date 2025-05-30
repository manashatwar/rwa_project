"use client";

import { Wallet, Globe, FileCheck, Landmark, Coins } from "lucide-react";
import { useEffect, useState } from "react";

interface PageLoadingProps {
  isLoading?: boolean;
}

export default function PageLoading({ isLoading = true }: PageLoadingProps) {
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: Wallet, color: "text-blue-600", bg: "bg-blue-100" },
    { Icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
    { Icon: Landmark, color: "text-purple-600", bg: "bg-purple-100" },
    { Icon: Coins, color: "text-orange-600", bg: "bg-orange-100" },
    { Icon: Globe, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 600);

    return () => clearInterval(interval);
  }, [isLoading, icons.length]);

  if (!isLoading) return null;

  const { Icon, color, bg } = icons[currentIcon];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-emerald-50/50" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-32 w-20 h-20 bg-emerald-200/20 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-200/20 rounded-full animate-pulse delay-3000" />
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div
            className={`w-20 h-20 ${bg} rounded-2xl flex items-center justify-center shadow-lg animate-scaleIn`}
          >
            <Icon className={`w-10 h-10 ${color} animate-pulse`} />
          </div>

          {/* Rotating Border */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-2xl animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slideUp">
            TangibleFi
          </h3>
          <p className="text-gray-600 animate-slideUp delay-200">
            Loading your portfolio...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIcon ? "bg-blue-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
