export type TCreateUpdateProductivity = {
  prod_log_id?: string;
  datetime: string; //? "2024-08-07T01:00:00Z";
  process: string;
  part_code: string;
  quantity: number | null;

  //! Not required // "", 0, null, undefined
  machine_name?: null | string;
  ng_quantity?: number | null;
  remarks?: string | null;

  date?: string;
  time_slot?: string | null;
};

export type TProductivity = {
  prod_log_id: string;
  datetime: string;
  process: string;
  machine_name: string;
  part_code: string;
  quantity: number;
  ng_quantity: number;
  remarks: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  time_slot: string;
  shift: string;
  part_name: string;
  creator_name: string | null;
};

export type TProductivitySummary = {
  datetime: string;
  time_slot: string;
  shift: string;
  process: string;
  part_code: string;
  part_name: string;
  quantity: number;
  ng_quantity: number;
};
