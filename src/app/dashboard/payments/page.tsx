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
} from "lucide-react";

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
  const statusConfig = {
    completed: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    },
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600",
    },
    failed: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-600",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
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

export default async function PaymentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
    `,
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
    `,
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

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Process loan payments in various cryptocurrencies
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${totalPaid.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completedPayments}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  $
                  {payments
                    ?.filter(
                      (p) =>
                        new Date(p.payment_date).getMonth() ===
                        new Date().getMonth(),
                    )
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Make Payment Form */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Make Payment
                </CardTitle>
                <CardDescription>
                  Process a loan payment using cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-select">Select Loan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a loan to pay" />
                      </SelectTrigger>
                      <SelectContent>
                        {loans?.map((loan: Loan) => (
                          <SelectItem key={loan.id} value={loan.id}>
                            {loan.assets?.name} - $
                            {loan.monthly_payment.toLocaleString()} due
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="USD">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crypto">Pay with Cryptocurrency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoCurrencies.map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol}>
                            <div className="flex items-center justify-between w-full">
                              <span>
                                {crypto.symbol} - {crypto.name}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                Rate: {crypto.rate}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment Amount:</span>
                      <span className="font-medium">$2,500.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Exchange Rate:</span>
                      <span className="font-medium">1 USDC = $1.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network Fee:</span>
                      <span className="font-medium">~$2.50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Required:</span>
                      <span>2,502.50 USDC</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Payments
                </CardTitle>
                <CardDescription>Your scheduled loan payments</CardDescription>
              </CardHeader>
              <CardContent>
                {loans && loans.length > 0 ? (
                  <div className="space-y-4">
                    {loans.slice(0, 5).map((loan: Loan) => {
                      const daysUntil = Math.ceil(
                        (new Date(loan.next_payment_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                      const isOverdue = daysUntil < 0;
                      const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

                      return (
                        <div
                          key={loan.id}
                          className={`p-4 rounded-lg border ${isOverdue ? "border-red-200 bg-red-50" : isDueSoon ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{loan.assets?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  loan.next_payment_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                ${loan.monthly_payment.toLocaleString()}
                              </p>
                              <p
                                className={`text-xs ${
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
                            size="sm"
                            className="w-full"
                            variant={
                              isOverdue
                                ? "destructive"
                                : isDueSoon
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {isOverdue ? "Pay Now (Overdue)" : "Pay Now"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming payments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Your recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments && payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment: Payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {payment.loans?.assets?.name || "Loan Payment"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString()}{" "}
                          • {payment.crypto_currency || payment.currency}
                        </p>
                        {payment.transaction_hash && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {payment.transaction_hash.slice(0, 10)}...
                            {payment.transaction_hash.slice(-8)}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payment.payment_status)}
                          <Badge variant="outline" className="text-xs">
                            {payment.blockchain}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Coins className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No payment history
                  </h3>
                  <p className="text-muted-foreground">
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
