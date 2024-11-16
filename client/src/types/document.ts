export type TCreateUpdateDocument = {
  document_id?: string;
  document_name: string;
  document_data?: string | null;
  source_file?: string;
  folder_id: string | null;

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
  folder_id: string;

  creator_name: string;
};

// "document_id": "dc9315ef-3060-4771-8939-8f8152e98346",
// "document_name": "xxxx",
// "document_description": "",
// "effective_date": null,
// "expire_date": null,
// "source_file": "https://sncservices.sncformer.com/data/iqcs/docs/v1/q9Gd0LRIRRultQgh73UW_1731656258049.pdf",
// "plant_code": "PLANT_TEST1",
// "creator_id": "ba68ea8e-1143-452f-9c5f-73b0f2a96827",
// "created_at": "2024-11-15T07:37:38.181Z",
// "updated_at": "2024-11-15T07:40:02.119Z",
// "folder_id": "9a4a2a61-1b68-460f-bbb7-4ced295139da",
// "creator_name": "Tester#1"
