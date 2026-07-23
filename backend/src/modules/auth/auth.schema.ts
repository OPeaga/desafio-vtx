import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter ao menos 6 caracteres")
    .regex(/[A-Z]/, "Senha deve ter ao menos 1 letra maiúscula"),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
