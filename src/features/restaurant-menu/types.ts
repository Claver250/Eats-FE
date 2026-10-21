export type RestaurantStat = {
  id: "total" | "awaiting" | "pending" | "paid";
  label: string;
  value: number;
  kind: "number" | "naira";
  change: number;
  caption: string; // text after the trend badge, e.g. "require attention"
  goodWhen: "up" | "down";
};

// Everything the Create Restaurant form sends to the backend.
export type NewRestaurantInput = {
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string; // normalised to +234XXXXXXXXXX
  specialty: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn?: string;
  registrationNumber?: string;
  documents: File[];
};

// The part of a new restaurant the page keeps in memory. Bank details, BVN and documents
// are deliberately not in here: they are sent to the API and then discarded.
export type RestaurantSummary = {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  specialty: string;
  status: "Pending";
};

export type RestaurantStatus = "Active" | "Pending" | "Suspended";

// One row of the Restaurant Directory.
export type DirectoryRestaurant = {
  id: string; // e.g. "WE-REST-001". The table shows it as "REST-001", like the design.
  name: string;
  location: string;
  status: RestaurantStatus;
};


export type RecentOrderStatus = "Paid" | "Pending" | "Suspended";

export type RecentOrder = {
  id: string; // e.g. "#WE123456"
  date: string; // YYYY-MM-DD
  amount: number; // Naira
  status: RecentOrderStatus;
};