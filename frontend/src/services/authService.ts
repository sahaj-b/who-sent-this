import { TUser } from "../types";
const url = "http://localhost:3000/api/users";
import { throwFormattedError } from "../utils/errorHandler";

export async function ApiLogin(
  email: string,
  password: string,
): Promise<TUser | void> {
  const res = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Login");
  }
}

export async function ApiLogout() {
  const res = await fetch(`${url}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    await throwFormattedError(res, "Logout");
  }
}

export async function ApiRegisterAnonymous(): Promise<TUser | void> {
  const res = await fetch(`${url}/register-anonymous`, {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Anonymous register");
  }
}

export async function ApiRegisterWithEmail(
  email: string,
  password: string,
  name: string | undefined = undefined,
): Promise<TUser | void> {
  const res = await fetch(`${url}/register-with-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Register");
  }
}

export async function ApiRegisterEmail(
  email: string,
  password: string,
  name?: string,
): Promise<TUser | void> {
  const res = await fetch(`${url}/add-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Registering email");
  }
}

export async function ApiRefreshToken() {
  const res = await fetch(`${url}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return await throwFormattedError(res, "Refreshing Token");
}

export async function ApiUserInfo(): Promise<TUser | void> {
  const res = await fetch(`${url}/me`, {
    credentials: "include",
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Getting user settings");
  }
}

export async function ApiChangeUserSettings(
  receivingPaused?: boolean,
  name?: string,
  password?: string,
  newPassword?: string,
): Promise<TUser | void> {
  const res = await fetch(`${url}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ receivingPaused, name, password, newPassword }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Updating user settings");
  }
}

export async function ApiDeleteUser(password?: string) {
  const res = await fetch(`${url}/me`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) await throwFormattedError(res, "Deleting user");
}
