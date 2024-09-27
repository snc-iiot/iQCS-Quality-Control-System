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

export type TModelSummary = {
  model_id: string;
  model_name: string;
  production_quantity: string;
  ng_quantity: string;
  defect_percentage: string;
};

export type TPartSummary = {
  shift: "DAY" | "NIGHT";
  process_id: string;
  part_id: string;
  part_code: string;
  part_name: string;
  production_quantity: number;
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

export type TSNCPartDetail = {
  part_id: string;
  part_code: string;
  part_name: string;
  case_id: string;
  case_name: string;
  description: string;
  production_quantity: number;
  ng_quantity: number;
};

// export interface TSNCOverview {
//   part_id: string;
//   part_code: string;
//   part_name: string;
//   processes: string[];
//   plant_code: string;
//   production_quantity: number;
//   ng_quantity: number;
//   details: {
//     case_id: string;
//     case_name: string;
//     processes: string[];
//     ng_quantity: number;
//   }[];
//   defects_percentage: number | null;
// }

export interface ProcessSelection {
  plant_code: string;
  process_id: string;
}

export interface SNCOverviewItem extends TSNCOverview {}

export interface SNCOverviewProcess {
  process_id: string;
  process_name: string;
  data: SNCOverviewItem[];
}

export interface SNCOverviewData {
  plant_code: string;
  process: SNCOverviewProcess[];
}
