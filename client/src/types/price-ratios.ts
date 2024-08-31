export type TCreateUpdatePriceRatio = {
  ratio_id?: string;
  effective_date: string;
  ng_ratio: number | null;
  scrap_ratio: number | null;
  rework_ratio: number | null;
  remarks: string;
};

export type TPriceRatio = {
  ratio_id: string;
  effective_date: string;
  ng_ratio: string;
  scrap_ratio: string;
  rework_ratio: string;
  remarks: string;
  plant_code: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
};
