import { toast } from "react-toastify";

export function errorHandler(error: any) {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Something went wrong");
  }
}

export async function responseErrorHandler(res: Response, action: string) {
  const errorData = await res
    .json()
    .catch(() => ({ message: "Unknown error" }));
  console.error(errorData);
  throw new Error(
    errorData.message ?? `${action} failed with status: ${res.status}`,
  );
}
