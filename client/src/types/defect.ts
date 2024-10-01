export type TCreateUpdateDefect = {
  defects_log_id?: string;
  datetime: string;
  date?: string;
  time_slot?: string;
  defects_type: "S" | "P";
  process_id: string;
  part_id: string;
  case_id: string;
  model_name?: string;
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

export type TCreateUpdateDefectMultiple = {
  defects_log_id?: string;
  datetime: string;
  date?: string;
  time_slot?: string;
  defects_type: "S" | "P";
  process_id: string;
  part_id: string;
  defects: {
    case_id: string;
    ng_quantity: number | null;
  }[];

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
  date: string;
  datetime: string;
  defects_type: "S" | "P";
  process_id: string;
  machine_id: any;
  operator_id: any;
  part_id: string;
  case_id: string;
  production_quantity: number;
  ng_quantity: number;
  rework_quantity: number;
  scrap_quantity: number;
  claim_supplier_quantity: number;
  scrap_approval_sheet_no: string;
  car_no: string;
  image: string;
  solve_problem: string;
  remarks: string;
  plant_code: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  time_slot: string;
  shift: string;
  case_name: string;
  ng_description: string;
  creator_name: string;
  part_code: string;
  part_name: string;
  customers: any[];
  machine_no: string;
  machine_name: string;
  employee_id: string;
  operator_name: string;
  price: number;
  ng_price: number;
  scrap_price: number;
  rework_price: number;
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
