export type TCreateUpdateAccount = {
  account_id?: string;
  name: string;
  remark: string;
};

export type TAccount = {
  account_id: string;
  name: string;
  remark: string;
  created_at: string;
  updated_at: string;
};
