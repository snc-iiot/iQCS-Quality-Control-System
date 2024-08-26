export type TCreateUpdatePart = {
  part_id?: string;
  part_code: string;
  part_name: string;
  part_description: string;
};

export type TPart = {
  part_id: string;
  part_code: string;
  part_name: string;
  part_description: string;
  created_at: string;
  updated_at: string;
};
