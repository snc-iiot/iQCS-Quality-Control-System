export type TDataChart = {};

export type TGraphSummary = {
  datetime: string;
  date?: string;
  time_slot: string;
  shift: "DAY" | "NIGHT";
  process: string;
  ng_quantity: number;
};
