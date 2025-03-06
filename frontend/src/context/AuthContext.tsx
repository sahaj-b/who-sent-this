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
import { errorHandler } from "../utils/errorHandler";
import { toast } from "react-toastify";

interface AuthContextType {
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
  changeSettings: (
    receivingPaused?: boolean,
    name?: string,
    password?: string,
    newPassword?: string,
  ) => Promise<void>;
  deleteUser: () => Promise<void>;
}
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
    const data = await ApiLogin(email, password).catch(errorHandler);

    if (data) setUser(data);
  };

  const logout = async () => {
    await ApiLogout().catch(errorHandler);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const registerAnonymous = async () => {
    const data = await ApiRegisterAnonymous().catch(errorHandler);
    if (data) setUser(data);
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    const data = await ApiRegisterWithEmail(email, password, name).catch(
      errorHandler,
    );
    if (data) setUser(data);
  };

  const registerEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    await ApiRegisterEmail(email, password, name).catch(errorHandler);
  };

  const refreshToken = async () => {
    await ApiRefreshToken().catch(errorHandler);
  };

  const userInfo = async () => {
    return await ApiUserInfo().catch(errorHandler);
  };

  const changeSettings = async (
    receivingPaused?: boolean,
    name?: string,
    password?: string,
    newPassword?: string,
  ) => {
    if (!user) {
      errorHandler("User not found");
      return;
    }
    await ApiChangeUserSettings(
      receivingPaused,
      name,
      password,
      newPassword,
    ).catch(errorHandler);
    setUser({
      ...user,
      name,
      receivingPaused: receivingPaused ?? user.receivingPaused,
    });
  };

  const deleteUser = async () => {
    await ApiDeleteUser().catch(errorHandler);
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
