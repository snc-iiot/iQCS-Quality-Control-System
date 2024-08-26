export type TResponse<T> = {
  data: T;
  message: string;
  status: "success" | "error";
  statusCode: number;
};
