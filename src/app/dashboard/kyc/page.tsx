"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Camera,
  User,
  Building,
  MapPin,
  CreditCard,
  Eye,
  Download,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const kycStatus = {
  overall: "in_progress", // "not_started", "in_progress", "pending_review", "approved", "rejected"
  completionPercentage: 65,
  documents: {
    identity: { status: "approved", uploadDate: "2024-01-15" },
    address: { status: "pending_review", uploadDate: "2024-01-16" },
    income: { status: "not_uploaded", uploadDate: null },
    selfie: {
      status: "rejected",
      uploadDate: "2024-01-14",
      reason: "Image quality too low",
    },
  },
  lastUpdate: "2024-01-16T10:30:00Z",
  estimatedReview: "2-3 business days",
};

const kycSteps = [
  {
    id: "personal_info",
    title: "Personal Information",
    description: "Basic personal details and contact information",
    status: "completed",
    icon: User,
  },
  {
    id: "identity_verification",
    title: "Identity Verification",
    description: "Government-issued ID verification",
    status: "completed",
    icon: Shield,
  },
  {
    id: "address_verification",
    title: "Address Verification",
    description: "Proof of residence document",
    status: "in_progress",
    icon: MapPin,
  },
  {
    id: "financial_verification",
    title: "Financial Information",
    description: "Income and source of funds verification",
    status: "pending",
    icon: CreditCard,
  },
  {
    id: "final_review",
    title: "Final Review",
    description: "Compliance team review and approval",
    status: "pending",
    icon: CheckCircle,
  },
];

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [uploading, setUploading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending_review":
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending_review":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFileUpload = (documentType: string) => {
    setUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">
            Complete your identity verification to access all platform features
          </p>
        </div>
        <Badge className={getStatusColor(kycStatus.overall)}>
          {kycStatus.overall.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verification Progress
              </h3>
              <p className="text-sm text-gray-500">
                {kycStatus.completionPercentage}% completed • Estimated review:{" "}
                {kycStatus.estimatedReview}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {kycStatus.completionPercentage}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <Progress value={kycStatus.completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* KYC Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kycSteps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                      currentStep === index
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-100"
                          : step.status === "in_progress"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <StepIcon
                        className={`w-5 h-5 ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "in_progress"
                              ? "text-blue-600"
                              : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                    {getStatusIcon(step.status)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {kycSteps[currentStep]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && <PersonalInfoStep />}
            {currentStep === 1 && <IdentityVerificationStep />}
            {currentStep === 2 && (
              <AddressVerificationStep
                onUpload={handleFileUpload}
                uploading={uploading}
              />
            )}
            {currentStep === 3 && <FinancialVerificationStep />}
            {currentStep === 4 && <FinalReviewStep />}
          </CardContent>
        </Card>
      </div>

      {/* Document Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(kycStatus.documents).map(([docType, doc]) => (
              <div
                key={docType}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {docType.replace("_", " ")}
                  </h4>
                  {getStatusIcon(doc.status)}
                </div>

                <Badge className={`${getStatusColor(doc.status)} text-xs mb-2`}>
                  {doc.status.replace("_", " ").toUpperCase()}
                </Badge>

                {doc.uploadDate && (
                  <p className="text-xs text-gray-500 mb-2">
                    Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                )}

                {doc.status === "rejected" && doc.reason && (
                  <p className="text-xs text-red-600 mb-2">{doc.reason}</p>
                )}

                <div className="flex gap-2">
                  {doc.status !== "not_uploaded" && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="w-3 h-3 mr-1" />
                    {doc.status === "not_uploaded" ? "Upload" : "Replace"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Secure & Compliant
              </h4>
              <p className="text-sm text-gray-600">
                Bank-grade security and regulatory compliance
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Data Protection
              </h4>
              <p className="text-sm text-gray-600">
                Your documents are encrypted and securely stored
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Review</h4>
              <p className="text-sm text-gray-600">
                Most verifications completed within 24-48 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Step Components
function PersonalInfoStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-green-600 mb-4">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Personal information completed</span>
      </div>
      <p className="text-gray-600">
        Your personal information has been successfully verified and is up to
        date.
      </p>
    </div>
  );
}

function IdentityVerificationStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-green-600 mb-4">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Identity verified</span>
      </div>
      <p className="text-gray-600">
        Your government-issued ID has been successfully verified.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Verified Document</h4>
        <p className="text-green-700 text-sm">
          Driver's License - Approved on Jan 15, 2024
        </p>
      </div>
    </div>
  );
}

function AddressVerificationStep({
  onUpload,
  uploading,
}: {
  onUpload: (type: string) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-yellow-600 mb-4">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Pending review</span>
      </div>

      <p className="text-gray-600 mb-4">
        Upload a recent utility bill, bank statement, or official document
        showing your current address.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h4 className="font-medium text-gray-900 mb-2">Upload Address Proof</h4>
        <p className="text-sm text-gray-500 mb-4">
          Accepted formats: PDF, JPG, PNG (max 10MB)
        </p>
        <Button onClick={() => onUpload("address")} disabled={uploading}>
          {uploading ? "Uploading..." : "Choose File"}
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Under Review</h4>
        <p className="text-yellow-700 text-sm">
          Your address document is currently being reviewed by our compliance
          team.
        </p>
      </div>
    </div>
  );
}

function FinancialVerificationStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Pending completion</span>
      </div>

      <p className="text-gray-600 mb-4">
        Please provide documentation about your source of funds and income
        verification.
      </p>

      <div className="space-y-3">
        <Label>Annual Income Range</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select income range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under_50k">Under $50,000</SelectItem>
            <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k_250k">$100,000 - $250,000</SelectItem>
            <SelectItem value="250k_500k">$250,000 - $500,000</SelectItem>
            <SelectItem value="over_500k">Over $500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Source of Funds</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select source of funds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employment">Employment Income</SelectItem>
            <SelectItem value="business">Business Ownership</SelectItem>
            <SelectItem value="investments">Investment Returns</SelectItem>
            <SelectItem value="inheritance">Inheritance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Submit Financial Information</Button>
    </div>
  );
}

function FinalReviewStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Awaiting final review</span>
      </div>

      <p className="text-gray-600 mb-4">
        Complete all previous steps to proceed with the final compliance review.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Our compliance team will review all submitted documents</li>
          <li>• You'll receive email updates on the review progress</li>
          <li>• Final approval typically takes 1-3 business days</li>
          <li>
            • You'll get full access to all platform features upon approval
          </li>
        </ul>
      </div>
    </div>
  );
}
