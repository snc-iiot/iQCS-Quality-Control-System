export type TCreateUpdateDocument = {
  document_name: string;
  document_data: string;

  //! Not required
  document_description?: string;
  effective_date?: string;
  expire_date?: string;
};

export type TDocument = {
  document_name: string;
  document: string;
  inspector_name: string;
  inspector_id: string;
  created_at: string;
  updated_at: string;
};
