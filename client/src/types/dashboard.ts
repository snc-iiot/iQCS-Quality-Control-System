export type TDataChart = {};

export type TGraphSummary = {
  datetime: string;
  date?: string;
  time_slot: string;
  shift: "DAY" | "NIGHT";
  process_id: string;
  process_name: string;
  ng_quantity: number;
};
