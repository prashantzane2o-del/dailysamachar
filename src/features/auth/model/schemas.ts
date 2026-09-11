import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});
export const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Enter your name"),
  consent: z.literal(true, { error: "Consent is required" }),
});
export const resetSchema = z.object({ email: z.string().email("Enter a valid email address") });
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
