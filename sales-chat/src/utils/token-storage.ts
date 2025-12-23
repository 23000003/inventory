type TokenData = {
  access_token: string;
  expires_in: number;
};

export const ACCESS_TOKEN_KEY = "__jwt_token__";
export const EXPIRES_IN_KEY = "__expires_in__";

export const TokenStorage = {
  storeTokens(data: TokenData) {
    const expiryTime = Date.now() + data.expires_in * 1000;
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(EXPIRES_IN_KEY, expiryTime.toString());
  },

  getAccessToken(): string | null {
    const expiryTime = localStorage.getItem(EXPIRES_IN_KEY);

    if (expiryTime && Date.now() < parseInt(expiryTime)) {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  getExpiryTime(): number {
    return parseInt(localStorage.getItem(EXPIRES_IN_KEY) ?? "0");
  },

  removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_IN_KEY);
  },
};
