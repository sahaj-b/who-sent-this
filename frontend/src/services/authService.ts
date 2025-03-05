import { TUser } from "../types";
const url = "http://localhost:3000/api/users";
import { responseErrorHandler } from "../utils/errorHandler";

export async function ApiLogin(
  email: string,
  password: string,
  name: string | undefined = undefined,
): Promise<TUser | void> {
  const res = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Login");
  }
}

export async function ApiLogout() {
  const res = await fetch(`${url}/logout`, {
    method: "POST",
  });

  if (!res.ok) {
    await responseErrorHandler(res, "Logout");
  }
}

export async function ApiRegisterAnonymous(): Promise<TUser | void> {
  const res = await fetch(`${url}/register-anonymous`, {
    method: "POST",
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Anonymous register");
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
    body: JSON.stringify({ email, password, name }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Register");
  }
}

export async function ApiRegisterEmail(email: string): Promise<TUser | void> {
  const res = await fetch(`${url}/add-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Registering email");
  }
}

export async function ApiRefreshToken() {
  const res = await fetch(`${url}/refresh-token`, {
    method: "POST",
  });

  if (!res.ok) return await responseErrorHandler(res, "Refreshing Token");
}

export async function ApiUserInfo(): Promise<TUser | void> {
  const res = await fetch(`${url}/me`);

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Getting user settings");
  }
}

export async function ApiChangeUserSettings(
  receivingPaused?: boolean,
  name?: string,
  password?: string,
  newPassword?: string,
): Promise<TUser | void> {
  const res = await fetch(`${url}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receivingPaused, name, password, newPassword }),
  });

  if (res.ok) {
    const body = await res.json();
    return body.data;
  } else {
    return await responseErrorHandler(res, "Updating user settings");
  }
}

export async function ApiDeleteUser() {
  const res = await fetch(`${url}/me`, {
    method: "DELETE",
  });
  if (!res.ok) await responseErrorHandler(res, "Deleting user");
}
