import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { isSessionExpired } from "../utils/validate-session.util";
import { JWT_LOCAL_STORAGE_KEY } from "../config/constants";
import type { UserInfoType } from "@/types/user-info";

export interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  userInfo: UserInfoType;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<UserInfoType>({
    userId: -1,
    name: "",
    email: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUserInfo({
      userId: -1,
      name: "",
      email: "",
    });
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
  }, []);

  const setAuth = useCallback(
    (token: string) => {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode<UserInfoType & { exp: number }>(token);
      if (isSessionExpired(decodedToken.exp)) {
        clearAuth();
        return;
      }
      setUserInfo(decodedToken);
      localStorage.setItem(JWT_LOCAL_STORAGE_KEY, token);
    },
    [clearAuth]
  );

  useEffect(() => {
    const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
    if (token) {
      setAuth(token);
    } else {
      clearAuth();
    }
    setLoading(false);
  }, [setAuth, clearAuth]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userInfo,
      setAuth,
      clearAuth,
      loading
    }),
    [userInfo, isAuthenticated, setAuth, clearAuth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
