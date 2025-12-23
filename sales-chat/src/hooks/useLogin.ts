import type { LoginSchemaType } from "@/schemas/login.schema";
import AuthService from "@/services/auth.service";
import type { ApiResponse } from "@/types/api-response";
import { type MutationKey, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAuth from "./useAuth";

type Callback = (message: string) => void;

const login = async (body: LoginSchemaType) => {
  const { data } = await AuthService.loginUser(body);
  return data;
}

const useLogin = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const { setAuth } = useAuth();

  return useMutation({
    mutationKey: ["Login", options?.deps],
    mutationFn: login,
    onSuccess: (response: ApiResponse<string>) => {
      setAuth(response?.data || "");
      options?.onSuccess?.("Login successful");
    },
    onError: (error: AxiosError<ApiResponse>) => {
      options?.onError?.(
        (Array.isArray(error.response?.data.message)
          ? error.response?.data.message.join(", ")
          : error.response?.data.message) ?? "Something went wrong, please try again",
      );
    },
  });
};

export default useLogin;
