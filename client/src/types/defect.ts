export type TCreateUpdateDefect = {
  defects_log_id?: string;
  datetime: string;
  date?: string;
  time_slot?: string;
  defects_type: "S" | "P";
  process_id: string;
  part_id: string;
  case_id: string;
  ng_quantity: number | null;

  // Optional
  machine_id?: string;
  operator_id?: string;
  production_quantity?: number | null;
  rework_quantity?: number | null;
  scrap_quantity?: number | null;
  claim_supplier_quantity?: number | null;
  scrap_approval_sheet_no: string;
  car_no?: string;
  image: string | null;
  solve_problem: string;
  remarks: string;
};

export type TDefect = {
  defects_log_id: string;
  datetime: string;
  process: string;
  machine_name: string;
  part_code: string;
  case_id: string;
  ng_quantity: number;
  rework_quantity: number;
  rework_cost_per_unit: number;
  scrap_quantity: number;
  scrap_cost_per_unit: number;
  image: string;
  remarks: string;
  inspector_id: string;
  created_at: string;
  updated_at: string;
  solve_problem: string;
  time_slot: string;
  shift: string;
  case_name: string;
  ng_description: string;
  inspector_name: string;
  part_name: string;
};

export type TDefectSummary = {
  datetime: string;
  process: string;
  ng_quantity: number;
  rework_quantity: number;
  rework_cost_per_unit: number;
  scrap_quantity: number;
  scrap_cost_per_unit: number;
  inspector_id: string;
  inspector_name: string;
};

export type TTopDefect = {
  case_id: string;
  case_name: string;
  ng_quantity: number;
};
