"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";

interface AnalyticsSectionProps {
  onBack: () => void;
}

export default function AnalyticsSection({ onBack }: AnalyticsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Analytics & Monitoring
          </h2>
          <p className="text-blue-200">
            Platform metrics and performance tracking
          </p>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-200">
            Coming soon - Platform analytics and monitoring
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
