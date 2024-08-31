import { Call } from "./call";

export const postRequest = <T, R>({ path, headers = {}, req }: { path: string; headers?: Record<string, string>; req: T }) =>
  Call<T, R>({
    path: path,
    method: "POST",
    headers: headers,
    request: req,
  });

  export const getRequest = <T, R>({ path, headers = {} }: { path: string; headers?: Record<string, string> }) =>
    Call<T, R>({
      path: path,
      method: "GET",
      headers: headers,
    });
  
