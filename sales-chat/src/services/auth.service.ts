import { api } from "@/config/axios";
import type { LoginSchemaType } from "@/schemas/login.schema";
import type { ApiResponse } from "@/types/api-response";

const BASE_URL = `/auth`;

const AuthService = {
  loginUser: async (data: LoginSchemaType) =>
    api.post<ApiResponse<string>>(`${BASE_URL}/login`, data),
};

export default AuthService;