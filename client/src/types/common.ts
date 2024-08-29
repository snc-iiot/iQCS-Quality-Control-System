export type TResponse<T> = {
  data: T;
  message: string;
  status: "success" | "error";
  statusCode: number;
};

export type TPlant = {
  plant_code: string;
  plant_description: string;
  company: string | null;
  business_type: string | null;
};
