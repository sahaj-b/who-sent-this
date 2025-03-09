import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { TUser } from "../types";
import {
  ApiChangeUserSettings,
  ApiDeleteUser,
  ApiLogin,
  ApiLogout,
  ApiRefreshToken,
  ApiRegisterAnonymous,
  ApiRegisterEmail,
  ApiRegisterWithEmail,
  ApiUserInfo,
} from "../services/authService";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { toast } from "react-toastify";

type settings = {
  receivingPaused?: boolean;
  name?: string;
  password?: string;
  newPassword?: string;
};

export type AuthContextType = {
  user: TUser | null;
  setUser: React.Dispatch<React.SetStateAction<TUser | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerAnonymous: () => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<void>;
  registerEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<void>;
  refreshToken: () => Promise<void>;
  userInfo: () => Promise<TUser | null | void>;
  changeSettings: (settings: settings) => Promise<void>;
  deleteUser: (password?: string) => Promise<void>;
};
const initialAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  registerAnonymous: async () => {},
  registerWithEmail: async () => {},
  registerEmail: async () => {},
  refreshToken: async () => {},
  userInfo: async () => null,
  changeSettings: async () => {},
  deleteUser: async () => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const login = async (email: string, password: string) => {
    const data = await ApiLogin(email, password).catch(toastifyAndThrowError);

    if (data) setUser(data);
  };

  const logout = async () => {
    await ApiLogout().catch(toastifyAndThrowError);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const registerAnonymous = async () => {
    const data = await ApiRegisterAnonymous().catch(toastifyAndThrowError);
    if (data) setUser(data);
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    const data = await ApiRegisterWithEmail(email, password, name).catch(
      toastifyAndThrowError,
    );
    if (data) setUser(data);
  };

  const registerEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    const data = await ApiRegisterEmail(email, password, name).catch(
      toastifyAndThrowError,
    );
    if (data) setUser(data);
  };

  const refreshToken = async () => {
    await ApiRefreshToken().catch(toastifyAndThrowError);
  };

  const userInfo = async () => {
    return await ApiUserInfo().catch(toastifyAndThrowError);
  };

  const changeSettings = async ({
    receivingPaused,
    name,
    password,
    newPassword,
  }: settings) => {
    if (!user) {
      toastifyAndThrowError("User not found");
      return;
    }
    await ApiChangeUserSettings(
      receivingPaused,
      name,
      password,
      newPassword,
    ).catch(toastifyAndThrowError);
    setUser({
      ...user,
      name,
      receivingPaused: receivingPaused ?? user.receivingPaused,
    });
  };

  const deleteUser = async (password?: string) => {
    await ApiDeleteUser(password).catch(toastifyAndThrowError);
    setUser(null);
  };

  useEffect(() => {
    ApiUserInfo()
      .then((data) => setUser(data ?? null))
      .catch();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        registerAnonymous,
        registerWithEmail,
        registerEmail,
        refreshToken,
        userInfo,
        changeSettings,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
