export type TCreateUpdateMachine = {
  machine_id?: string;
  machine_name: string;
  machine_no: string | null;
  description: string | null;
  location: string | null;
};

export type TMachine = {
  machine_id: string;
  machine_name: string;
  machine_no: string;
  location: string;
  description: string;
  created_at: string;
  updated_at: string;
};
