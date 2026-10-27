export type PayoutStatus = "Pending" | "Ready" | "Paid";

// One restaurant's payout position for the chosen period.
// "Balance to pay" is not stored: it is always totalAmount - totalPayout (see balanceToPay).
export type PayoutRow = {
  id: string; // e.g. "WE-REST-001"
  name: string;
  location: string;
  cuisine: string;
  orders: number;
  totalAmount: number; // Naira owed to the restaurant for the period
  totalPayout: number; // Naira already paid out
  status: PayoutStatus;
};

export const balanceToPay = (r: Pick<PayoutRow, "totalAmount" | "totalPayout">) =>
  r.totalAmount - r.totalPayout;

export type PaymentTotals = {
  earnings: number; // always paidOut + pending
  paidOut: number;
  pending: number;
  available: number; // money sitting in the WeEats account
  days: number; // length of the chosen period
};

// A recent order shown in a restaurant's payment details.
export type RecentPayoutOrder = {
  id: string; // e.g. "#WE123456"
  date: string; // YYYY-MM-DD
  amount: number; // Naira
  status: "Paid" | "Pending";
};