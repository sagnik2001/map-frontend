import { notifications } from "@mantine/notifications";
import config from "../config";

const apiUrl = config.API_URL

export async function Call<T, ResponseType>({
  path,
  request,
  suppressError,
  headers = {},
  method,
}: {
  path: string;
  request?: T;
  suppressError?: boolean;
  autoClose?: number | false;
  method: "POST" | "GET";
  headers: Record<string, string>;
}): Promise<ResponseType> {
  const response = await fetch(`${apiUrl}${path}`, {
    method: method,
    body: JSON.stringify(request),
    headers: headers,
  });
  if (Math.floor(response.status / 100) === 2) {
    return (await response.json()) as ResponseType;
  }
  const output = await response.json();
  const errMsg = "Something went wrong.";
  if (!suppressError) {
    notifications.show({
      title: errMsg,
      message: "Please try again",
    });
  }
  throw { handled: !suppressError, wrapped: output };
}
