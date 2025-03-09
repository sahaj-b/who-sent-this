import { toast } from "react-toastify";

export function toastifyAndThrowError(error: any) {
  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  } else {
    toast.error("Something went wrong");
    throw new Error("Unknown error");
  }
}

export async function throwFormattedError(res: Response, action: string) {
  const errorData = await res.json().catch(() => ({
    message:
      "Server Error: " + res.status + " " + res.statusText || "Unknown error",
  }));
  console.error(errorData);
  throw new Error(
    errorData.message ?? `${action} failed with status: ${res.status}`,
  );
}
