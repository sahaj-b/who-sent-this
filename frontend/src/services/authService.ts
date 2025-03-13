import { TUser } from "../types";
const usersUrl = import.meta.env.VITE_SERVER_URL + "/users";
import { throwFormattedError } from "../utils/errorHandler";

export type Settings = {
  receivingPaused?: boolean;
  name?: string;
  password?: string;
  newPassword?: string;
};

export async function ApiLogin(
  email: string,
  password: string,
): Promise<TUser | void> {
  const res = await fetch(`${usersUrl}/login`, {
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
  const res = await fetch(`${usersUrl}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    await throwFormattedError(res, "Logout");
  }
}

export async function ApiRegisterAnonymous(): Promise<TUser | void> {
  const res = await fetch(`${usersUrl}/register-anonymous`, {
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
  const res = await fetch(`${usersUrl}/register-with-email`, {
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
  const res = await fetch(`${usersUrl}/add-email`, {
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
  const res = await fetch(`${usersUrl}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return await throwFormattedError(res, "Refreshing Token");
}

export async function ApiUserInfo(): Promise<TUser | void> {
  const res = await fetch(`${usersUrl}/me`, {
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
  settings: Settings,
): Promise<TUser | void> {
  const res = await fetch(`${usersUrl}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(settings),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await throwFormattedError(res, "Updating user settings");
  }
}

export async function ApiDeleteUser(password?: string) {
  const res = await fetch(`${usersUrl}/me`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) await throwFormattedError(res, "Deleting user");
}
