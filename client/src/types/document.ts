export type TCreateUpdateDocument = {
  document_id?: string;
  document_name: string;
  document_data: string;

  //! Not required
  document_description?: string;
  effective_date?: string;
  expire_date?: string;
};

export type TDocument = {
  document_id: string;
  document_name: string;
  document_description: string;
  effective_date: string;
  expire_date: string;
  source_file: string;
  plant_code: string;
  creator_id: string;
  created_at: string;
  updated_at: string;

  // ? +++
  inspector_name: string;
};
