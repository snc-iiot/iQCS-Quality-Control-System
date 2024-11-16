export type TCreateUpdateFolder = {
  folder_id?: string;
  folder_name: string;
};

export type TFolder = {
  folder_id: string;
  folder_name: string;
  plant_code: string;
  creator_id: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
  number_of_files: number | null;
};
