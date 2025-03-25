
// Store dimension
export interface Store {
  id: string;
  seqNo: number;
  label: string;
  city: string;
  state: string;
}

// SKU dimension
export interface SKU {
  id: string;
  seqNo: number;
  label: string;
  price: number;
  cost: number;
}

// Calendar dimension
export interface Week {
  id: string; // e.g. W01, W02, etc.
  month: string; // Month name, e.g. January, February, etc.
}

// Planning data
export interface PlanningCell {
  storeId: string;
  skuId: string;
  weekId: string;
  salesUnits: number;
  salesDollars?: number; // Calculated: salesUnits * price
  gmDollars?: number; // Calculated: salesDollars - (salesUnits * cost)
  gmPercentage?: number; // Calculated: gmDollars / salesDollars
}
