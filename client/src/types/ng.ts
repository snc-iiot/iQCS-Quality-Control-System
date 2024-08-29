export type TNGCause = {
  case_id: string;
  case_name: string;
  description: string;
  processes: string[];
  plant_code: string;
  created_at: string;
  updated_at: string;
};

export type TCreateNGCause = {
  case_id?: string;
  case_name: string;
  processes: string[];
  description: string;
};
