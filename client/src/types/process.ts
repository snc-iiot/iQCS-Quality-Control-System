export type TCreateUpdateProcess = {
  process_id: string;
  process_name: string;
  process_description: string;
};

export type TProcess = {
  process_id: string;
  process_code: string;
  process_name: string;
  process_description: string;
  created_at: string;
  updated_at: string;
};
