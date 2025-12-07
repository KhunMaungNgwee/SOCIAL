export type APIResponse<T> = {
  message: string;
  status: number;
  data: T;
};