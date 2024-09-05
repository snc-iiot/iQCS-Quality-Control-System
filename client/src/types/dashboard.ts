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

export type TPartSummaryDetails = {
  case_id: string;
  case_name: string;
  ng_quantity: number;
};

export type TPartSummary = {
  shift: "DAY" | "NIGHT";
  process_id: string;
  part_id: string;
  part_code: string;
  part_name: string;
  ng_quantity: number;
  details: TPartSummaryDetails[];
};

export type TDefectsTypeReq = "ALL" | "P" | "S";

export type TSNCOverview = {
  process_id: string;
  process_name: string;
  process_description: string;
  part_id: string;
  part_code: string;
  part_name: string;
  plant_code: string;
  production_quantity: number;
  ng_quantity: number;
  defects_percentage: number;
};
