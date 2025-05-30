import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Landmark,
  Calendar,
  DollarSign,
  Percent,
  Plus,
  CreditCard,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface Loan {
  id: string;
  loan_amount: number;
  outstanding_balance: number;
  interest_rate: number;
  loan_term_months: number;
  monthly_payment: number;
  next_payment_date: string;
  loan_status: string;
  blockchain: string;
  created_at: string;
}

interface Asset {
  id: string;
  name: string;
  asset_type: string;
}

function getStatusBadge(status: string) {
  const variants = {
    active: "default" as const,
    pending: "secondary" as const,
    completed: "outline" as const,
    defaulted: "destructive" as const,
  };

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function getDaysUntilPayment(dateString: string): number {
  const paymentDate = new Date(dateString);
  const today = new Date();
  const diffTime = paymentDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default async function LoansPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: loans } = await supabase
    .from("loans")
    .select(
      `
      *,
      assets!loans_asset_id_fkey (
        id,
        name,
        asset_type
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalLoanAmount =
    loans?.reduce((sum, loan) => sum + loan.loan_amount, 0) || 0;
  const totalOutstanding =
    loans?.reduce((sum, loan) => sum + loan.outstanding_balance, 0) || 0;
  const totalMonthlyPayments =
    loans?.reduce((sum, loan) => sum + loan.monthly_payment, 0) || 0;
  const activeLoans =
    loans?.filter((loan) => loan.loan_status === "active").length || 0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Loan Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your loans and payment schedules
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/loans/new">
                <Plus className="h-4 w-4 mr-2" />
                Request Loan
              </Link>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  Active Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{activeLoans}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Borrowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${totalLoanAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Outstanding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${totalOutstanding.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Monthly Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${totalMonthlyPayments.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Loans List */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Your Loans</CardTitle>
              <CardDescription>
                All your active and completed loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loans && loans.length > 0 ? (
                <div className="space-y-6">
                  {loans.map((loan: Loan & { assets: Asset }) => {
                    const paymentProgress =
                      ((loan.loan_amount - loan.outstanding_balance) /
                        loan.loan_amount) *
                      100;
                    const daysUntilPayment = getDaysUntilPayment(
                      loan.next_payment_date,
                    );
                    const isPaymentDue = daysUntilPayment <= 7;

                    return (
                      <Card
                        key={loan.id}
                        className={`border ${isPaymentDue ? "border-yellow-200 bg-yellow-50/30" : ""}`}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <CardTitle className="text-xl">
                                  ${loan.loan_amount.toLocaleString()} Loan
                                </CardTitle>
                                {getStatusBadge(loan.loan_status)}
                                <Badge variant="outline" className="text-xs">
                                  {loan.blockchain}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                <Landmark className="h-4 w-4" />
                                Collateral: {loan.assets?.name || "Asset"} (
                                {loan.assets?.asset_type || "Unknown"})
                              </CardDescription>
                            </div>
                            {isPaymentDue && (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Payment Due
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Loan Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Outstanding Balance
                              </p>
                              <p className="font-semibold">
                                ${loan.outstanding_balance.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Interest Rate
                              </p>
                              <p className="font-semibold flex items-center gap-1">
                                <Percent className="h-3 w-3" />
                                {loan.interest_rate}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Monthly Payment
                              </p>
                              <p className="font-semibold">
                                ${loan.monthly_payment.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Term
                              </p>
                              <p className="font-semibold">
                                {loan.loan_term_months} months
                              </p>
                            </div>
                          </div>

                          {/* Payment Progress */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Loan Progress
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {paymentProgress.toFixed(1)}% paid
                              </span>
                            </div>
                            <Progress value={paymentProgress} className="h-3" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>
                                Paid: $
                                {(
                                  loan.loan_amount - loan.outstanding_balance
                                ).toLocaleString()}
                              </span>
                              <span>
                                Remaining: $
                                {loan.outstanding_balance.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Next Payment Info */}
                          <div
                            className={`p-4 rounded-lg border ${isPaymentDue ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="font-medium flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Next Payment Due
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    loan.next_payment_date,
                                  ).toLocaleDateString()}
                                  (
                                  {daysUntilPayment > 0
                                    ? `${daysUntilPayment} days`
                                    : "Today"}
                                  )
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">
                                  ${loan.monthly_payment.toLocaleString()}
                                </p>
                                <Button size="sm" className="mt-2" asChild>
                                  <Link
                                    href={`/dashboard/payments?loan=${loan.id}`}
                                  >
                                    Make Payment
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            Loan originated{" "}
                            {new Date(loan.created_at).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Landmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No loans found</h3>
                  <p className="text-muted-foreground mb-6">
                    Use your assets as collateral to secure your first loan
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/loans/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Your First Loan
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
