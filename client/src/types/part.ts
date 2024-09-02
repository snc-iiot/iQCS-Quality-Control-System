export type TCreateUpdatePart = {
  part_id?: string;
  part_code: string;
  part_name: string;
  processes: string[];
  price: number;

  //! Not required
  sap_code: string;
  part_description: string;
  customers: string[];
};

export type TPart = {
  part_id: string;
  sap_code: string | null;
  part_code: string;
  part_name: string;
  part_description: string;
  processes: string[];
  price: string;
  customers: string[];
  plant_code: string;
  created_at: string;
  updated_at: string;
};
