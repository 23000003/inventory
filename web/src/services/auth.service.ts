import type { LoginSchemaType } from "@/schemas/login.schema";

export class AuthService {
  static async login(data: LoginSchemaType) {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    }
  }
}