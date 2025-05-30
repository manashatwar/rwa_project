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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Coins,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Wallet,
  Activity,
  TrendingUp,
  Building,
  DollarSign,
} from "lucide-react";
import { SubmitButton } from "@/components/submit-button";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  crypto_currency: string;
  exchange_rate: number;
  transaction_hash: string;
  blockchain: string;
  payment_status: string;
  payment_date: string;
  loans: {
    id: string;
    loan_amount: number;
    monthly_payment: number;
    assets: {
      name: string;
    };
  };
}

interface Loan {
  id: string;
  loan_amount: number;
  outstanding_balance: number;
  monthly_payment: number;
  next_payment_date: string;
  assets: {
    name: string;
  };
}

function getStatusBadge(status: string) {
  const colors = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    completed: CheckCircle,
    pending: Clock,
    failed: XCircle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <Badge
      variant="outline"
      className={`${colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"} font-medium flex items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

const cryptoCurrencies = [
  { symbol: "USDC", name: "USD Coin", rate: 1.0 },
  { symbol: "USDT", name: "Tether", rate: 1.0 },
  { symbol: "ETH", name: "Ethereum", rate: 0.0004 },
  { symbol: "BTC", name: "Bitcoin", rate: 0.000023 },
  { symbol: "MATIC", name: "Polygon", rate: 1.25 },
];

async function processPaymentAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const loanId = formData.get("loan_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const cryptoCurrency = formData.get("crypto_currency") as string;
  const blockchain = formData.get("blockchain") as string;

  // Find the selected crypto rate
  const selectedCrypto = cryptoCurrencies.find(
    (c) => c.symbol === cryptoCurrency
  );
  const exchangeRate = selectedCrypto?.rate || 1.0;

  // Generate a mock transaction hash
  const transactionHash = "0x" + Math.random().toString(16).substring(2, 66);

  // Insert payment record
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: user.id,
    loan_id: loanId,
    amount,
    currency: "USD",
    crypto_currency: cryptoCurrency,
    exchange_rate: exchangeRate,
    transaction_hash: transactionHash,
    blockchain,
    payment_status: "completed",
    payment_date: new Date().toISOString(),
  });

  if (paymentError) {
    console.error("Error creating payment:", paymentError);
    return;
  }

  // Update loan outstanding balance
  const { data: loan } = await supabase
    .from("loans")
    .select("outstanding_balance")
    .eq("id", loanId)
    .single();

  if (loan) {
    const newBalance = Math.max(0, loan.outstanding_balance - amount);
    await supabase
      .from("loans")
      .update({
        outstanding_balance: newBalance,
        loan_status: newBalance === 0 ? "completed" : "active",
      })
      .eq("id", loanId);
  }

  return redirect("/dashboard/payments?success=true");
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const params = await searchParams;
  const selectedLoanId = params.loan as string;
  const showSuccess = params.success === "true";

  // Fetch recent payments
  const { data: payments } = await supabase
    .from("payments")
    .select(
      `
      *,
      loans!payments_loan_id_fkey (
        id,
        loan_amount,
        monthly_payment,
        assets!loans_asset_id_fkey (
          name
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch active loans for payment selection
  const { data: loans } = await supabase
    .from("loans")
    .select(
      `
      *,
      assets!loans_asset_id_fkey (
        name
      )
    `
    )
    .eq("user_id", user.id)
    .eq("loan_status", "active")
    .order("next_payment_date", { ascending: true });

  const totalPaid =
    payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const completedPayments =
    payments?.filter((payment) => payment.payment_status === "completed")
      .length || 0;
  const pendingPayments =
    payments?.filter((payment) => payment.payment_status === "pending")
      .length || 0;

  const thisMonthPaid =
    payments
      ?.filter(
        (p) =>
          new Date(p.payment_date).getMonth() === new Date().getMonth() &&
          new Date(p.payment_date).getFullYear() === new Date().getFullYear()
      )
      .reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Payment Center
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Process loan payments in various cryptocurrencies
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Payment Successful!
                    </h3>
                    <p className="text-emerald-700">
                      Your payment has been processed and recorded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2 uppercase tracking-wide">
                  <Coins className="h-5 w-5" />
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalPaid.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-blue-600 mt-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Lifetime Total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-600 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle className="h-5 w-5" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {completedPayments}
                </p>
                <div className="flex items-center gap-1 text-emerald-600 mt-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Successful Payments
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-yellow-600 flex items-center gap-2 uppercase tracking-wide">
                  <Clock className="h-5 w-5" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingPayments}
                </p>
                <div className="flex items-center gap-1 text-yellow-600 mt-2">
                  <Building className="h-4 w-4" />
                  <span className="text-sm font-medium">Processing</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-purple-600 flex items-center gap-2 uppercase tracking-wide">
                  <CreditCard className="h-5 w-5" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  ${thisMonthPaid.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-purple-600 mt-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Current Month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Make Payment Form */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wallet className="h-6 w-6 text-blue-600" />
                  Make Payment
                </CardTitle>
                <CardDescription className="text-base">
                  Process a loan payment using cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form action={processPaymentAction} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="loan_id"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Select Loan *
                    </Label>
                    <Select
                      name="loan_id"
                      defaultValue={selectedLoanId}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Choose a loan to pay" />
                      </SelectTrigger>
                      <SelectContent>
                        {loans?.map((loan: Loan) => (
                          <SelectItem key={loan.id} value={loan.id}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">
                                {loan.assets?.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-4">
                                ${loan.monthly_payment.toLocaleString()} due
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="amount"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Payment Amount *
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="2500.00"
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Currency
                      </Label>
                      <Select defaultValue="USD" disabled>
                        <SelectTrigger className="h-12 border-gray-200 bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="crypto_currency"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Pay with Cryptocurrency *
                    </Label>
                    <Select name="crypto_currency" required>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoCurrencies.map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">
                                {crypto.symbol} - {crypto.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-4">
                                Rate: {crypto.rate}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="blockchain"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Blockchain Network *
                    </Label>
                    <Select name="blockchain" required>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Payment Summary
                    </h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Payment Amount:
                      </span>
                      <span className="font-medium">$2,500.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Exchange Rate:
                      </span>
                      <span className="font-medium">1 USDC = $1.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Network Fee:
                      </span>
                      <span className="font-medium">~$2.50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total Required:</span>
                      <span className="text-blue-600">2,502.50 USDC</span>
                    </div>
                  </div>

                  <SubmitButton
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                    pendingText="Processing Payment..."
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Process Payment
                  </SubmitButton>
                </form>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  Upcoming Payments
                </CardTitle>
                <CardDescription className="text-base">
                  Your scheduled loan payments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {loans && loans.length > 0 ? (
                  <div className="space-y-6">
                    {loans.slice(0, 5).map((loan: Loan) => {
                      const daysUntil = Math.ceil(
                        (new Date(loan.next_payment_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const isOverdue = daysUntil < 0;
                      const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

                      return (
                        <div
                          key={loan.id}
                          className={`p-6 rounded-xl border transition-all duration-200 ${
                            isOverdue
                              ? "border-red-200 bg-red-50/30 shadow-md"
                              : isDueSoon
                                ? "border-yellow-200 bg-yellow-50/30 shadow-md"
                                : "border-gray-200 bg-gray-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold text-lg text-gray-900">
                                {loan.assets?.name}
                              </p>
                              <p className="text-base text-muted-foreground">
                                Due:{" "}
                                {new Date(
                                  loan.next_payment_date
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-2xl text-gray-900">
                                ${loan.monthly_payment.toLocaleString()}
                              </p>
                              <p
                                className={`text-sm font-medium ${
                                  isOverdue
                                    ? "text-red-600"
                                    : isDueSoon
                                      ? "text-yellow-600"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {isOverdue
                                  ? `${Math.abs(daysUntil)} days overdue`
                                  : isDueSoon
                                    ? `Due in ${daysUntil} days`
                                    : `Due in ${daysUntil} days`}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="lg"
                            className="w-full"
                            variant="outline"
                            asChild
                          >
                            <a href={`/dashboard/payments?loan=${loan.id}`}>
                              {isOverdue ? "Pay Now (Overdue)" : "Pay Now"}
                            </a>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      No upcoming payments
                    </h3>
                    <p className="text-lg">All your loans are up to date!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription className="text-base">
                Your recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {payments && payments.length > 0 ? (
                <div className="space-y-6">
                  {payments.map((payment: Payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-gray-50/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-2">
                        <p className="font-semibold text-lg text-gray-900">
                          {payment.loans?.assets?.name || "Loan Payment"}
                        </p>
                        <p className="text-base text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          • {payment.crypto_currency || payment.currency}
                        </p>
                        {payment.transaction_hash && (
                          <p className="text-sm text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded w-fit">
                            {payment.transaction_hash.slice(0, 10)}...
                            {payment.transaction_hash.slice(-8)}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-2xl text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(payment.payment_status)}
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50/80 text-gray-700 border-gray-200"
                          >
                            {payment.blockchain}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Coins className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-40" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    No payment history
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Your payment transactions will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
