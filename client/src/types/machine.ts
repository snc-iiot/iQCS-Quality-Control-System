export type TCreateUpdateMachine = {
  machine_id?: string;
  machine_name: string;
  machine_no: string;
  description: string;
};

export type TMachine = {
  machine_id: string
  machine_no: string
  machine_name: string
  description: string
  location: string
  plant_code: string
  created_at: string
  updated_at: string
};
