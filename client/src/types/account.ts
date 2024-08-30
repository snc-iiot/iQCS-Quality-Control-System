export type TCreateUpdateAccount = {
  operator_id?: string;
  operator_name: string;
  employee_id: string | null;
  position: string | null;
  responsibility: string | null;
  remarks: string | null;
};

export type TAccount = {
  operator_id: string;
  operator_name: string;
  employee_id: string | null;
  position: string | null;
  responsibility: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};
