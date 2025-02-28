import { TUser } from "../types";
import { useAuth } from "../context/AuthContext";

interface LoginRequest {
  email: string;
  password: string;
}

const url = "http://localhost:3000/api/users";

export async function login({
  email,
  password,
}: LoginRequest): Promise<TUser | null> {
  try {
    const res = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      return res.json();
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
