import { z } from "zod";

export const LoginSchema = z.object({
  // email: z
  //   .string()
  //   .min(1, {
  //     message: "Email Address is required.",
  //   })
  //   .email({
  //     message: "Invalid email address format.",
  //   }),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
