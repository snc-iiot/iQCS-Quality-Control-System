export type TNGCause = {
  ng_id: string;
  case_name: string;
  description: string;
  processes: string[];
  created_at: string;
  updated_at: string;
};

export type TCreateNGCause = {
  ng_id?: string;
  case_name: string;
  description: string;
  processes: string[];
};
