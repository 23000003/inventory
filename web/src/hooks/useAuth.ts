import { useUserStore } from "@/stores/useUserStore"
import type { UserInfoType } from "@/types/user-info";
import { TokenStorage } from "@/utils/token-storage";
import { jwtDecode } from "jwt-decode";
import { useCallback } from "react";
import { useNavigate } from "react-router";

const useAuth = () => {
  
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  
  const decodeToken = useCallback((token: string) => {
    const decodedToken = jwtDecode<UserInfoType & { exp: number }>(token);
    setUser({
      id: decodedToken.id,
      username: decodedToken.username,
    });
  }, [setUser]);

  const setAuth = (token: string) => {
    if (token) {
      decodeToken(token); 
      TokenStorage.storeTokens({
        access_token: token,
        expires_in: jwtDecode<UserInfoType & { exp: number }>(token).exp,
      });
    }
  };

  const clearAuth = useCallback(() => {
    setUser(undefined);
    TokenStorage.removeTokens();
    navigate("/login", { replace: true });
  }, [setUser, navigate]);

  const validateToken = useCallback(() => {
    const token = TokenStorage.getAccessToken();
    if (token) {
      decodeToken(token);
    } else {
      clearAuth();
    }
  }, [clearAuth, decodeToken]);

  return {
    setAuth,
    clearAuth,
    validateToken,
  }
}
export default useAuth;