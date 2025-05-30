"use server";

import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";

export async function createLoanRequestAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const assetId = formData.get("asset_id") as string;
  const loanAmount = parseFloat(formData.get("loan_amount") as string);
  const loanTermMonths = parseInt(formData.get("loan_term_months") as string);
  const interestRate = parseFloat(formData.get("interest_rate") as string);
  const purpose = formData.get("purpose") as string;
  const blockchain = formData.get("blockchain") as string;

  // Calculate monthly payment (simple interest calculation)
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  // Calculate next payment date (30 days from now)
  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

  const { error } = await supabase.from("loans").insert({
    user_id: user.id,
    asset_id: assetId,
    loan_amount: loanAmount,
    outstanding_balance: loanAmount,
    interest_rate: interestRate,
    loan_term_months: loanTermMonths,
    monthly_payment: monthlyPayment,
    next_payment_date: nextPaymentDate.toISOString(),
    loan_status: "pending",
    blockchain,
    purpose,
  });

  if (error) {
    console.error("Error creating loan request:", error);
    return;
  }

  // Update asset collateralization status
  await supabase
    .from("assets")
    .update({ collateralization_status: "collateralized" })
    .eq("id", assetId)
    .eq("user_id", user.id);

  return redirect("/dashboard/loans");
} 