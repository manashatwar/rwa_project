"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";
import PageLoading from "./page-loading";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NavigationDemo() {
  const { isLoading, navigateWithLoading } = useNavigation();

  const handleNavigate = (href: string) => {
    navigateWithLoading(href, 1000); // 1 second loading animation
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">Smooth Page Transitions</span>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Experience beautiful loading animations when navigating between pages
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => handleNavigate("/dashboard/assets")}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Go to Assets
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            onClick={() => handleNavigate("/dashboard/loans")}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Go to Loans
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <PageLoading isLoading={isLoading} />
    </>
  );
} 