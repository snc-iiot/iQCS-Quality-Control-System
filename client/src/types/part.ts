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

export type THistoryUpdatePrice = {
  update_price_id: string;
  effective_date: string;
  part_id: string;
  price: string;
  ng_price: string;
  scrap_price: string;
  rework_price: string;
  remarks: string;
  plant_code: string;
  creator_id: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
};

export type TCreateUpdatePartPrice = {
  effective_date: string;
  part_id: string;
  price: number | null;
  remarks: string;
};

export type TCreateUpdateModel = {
  model_id?: string;
  model_name: string;
  model_description: string;
};

export type TModel = {
  model_id: string;
  model_name: string;
  model_description: string;
  created_at: string;
  updated_at: string;
};
