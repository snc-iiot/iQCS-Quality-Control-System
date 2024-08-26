export type TCreateUpdateDefect = {
  defects_log_id?: string;
  datetime: string;
  date?: string;
  time_slot?: string;
  process: string;
  part_code: string;
  ng_id: string;
  ng_quantity: number | null;
  machine_name: string | null;
  rework_quantity: number | null;
  rework_cost_per_unit: number | null;
  scrap_quantity: number | null;
  scrap_cost_per_unit: number | null;
  image: string | null;
  solve_problem: string | null;
  remarks: string;
};

export type TDefect = {
  defects_log_id: string;
  datetime: string;
  process: string;
  machine_name: string;
  part_code: string;
  ng_id: string;
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
  ng_id: string;
  case_name: string;
  ng_quantity: number;
};
