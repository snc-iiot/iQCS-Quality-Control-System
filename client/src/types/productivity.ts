export type TCreateUpdateProductivity = {
  prod_log_id?: string;
  // datetime: string; //? "2024-08-07T01:00:00Z";
  // process: string;
  // part_code: string;
  // quantity: number | null;

  // //! Not required // "", 0, null, undefined
  // machine_name?: null | string;
  // ng_quantity?: number | null;
  // remarks?: string | null;

  date?: string;
  time_slot?: string | null;

  datetime: string;
  process_id: string;
  part_id: string;
  quantity: number;

  //! Not required // "", 0, null, undefined
  machine_id: string;
  operator_id: string;
  remarks: string;
};

export type TProductivity = {
  prod_log_id: string;
  datetime: string;
  process: string;
  process_id: string;
  machine_id: string;
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
  part_id: string;
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

export type TMapDataProductivity = {
  part_name: string;
  "08:00 - 09:00": number;
  "09:00 - 10:00": number;
  "10:00 - 11:00": number;
  "11:00 - 12:00": number;
  "12:00 - 13:00": number;
  "13:00 - 14:00": number;
  "14:00 - 15:00": number;
  "15:00 - 16:00": number;
  "16:00 - 17:00": number;
  "17:00 - 18:00": number;
  "18:00 - 19:00": number;
  "19:00 - 20:00": number;
  "20:00 - 21:00": number;
  "21:00 - 22:00": number;
  "22:00 - 23:00": number;
  "23:00 - 24:00": number;
  "24:00 - 01:00": number;
  "01:00 - 02:00": number;
  "02:00 - 03:00": number;
  "03:00 - 04:00": number;
  "04:00 - 05:00": number;
  "05:00 - 06:00": number;
  "06:00 - 07:00": number;
  "07:00 - 08:00": number;
};
