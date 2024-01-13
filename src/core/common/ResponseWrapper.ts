export type ReponseStatus = "success" | "error" | "timeout";
export interface BaseReponse<T> {
  status: ReponseStatus;
  message?: string | string[];
  data?: T;
  code?: number;
}

export function error<T>({
  ...props
}: Omit<BaseReponse<T>, "data" | "status">): BaseReponse<T> {
  return { ...props, status: "error" };
}
export function success<T>({
  ...props
}: Omit<BaseReponse<T>, "status">): BaseReponse<T> {
  return { ...props, status: "success" };
}
