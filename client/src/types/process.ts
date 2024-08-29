export type TCreateUpdateProcess = {
  process_id?: string;
  process_name: string;
  process_color: string;
  process_description: string;
};

export type TProcess = {
  process_id: string;
  process_name: string;
  process_color: string;
  process_description: string;
  created_at: string;
  updated_at: string;
  process_order: number;
  plant_code: string;
};
export type TProcessesOrder = {
  processes: string[];
};
