export type TServiceResponse = {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: any[];
};

export type TServiceResponse2<T> = {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: T;
};
