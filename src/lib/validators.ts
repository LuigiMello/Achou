import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo").max(80),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  city: z.string().min(2).default("São Paulo"),
  state: z.string().length(2).default("SP"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

export const listingSchema = z.object({
  title: z.string().min(5, "Título muito curto").max(100),
  description: z.string().min(20, "Descreva melhor seu produto").max(3000),
  price: z.coerce.number().min(0, "Preço inválido"),
  negotiable: z.boolean().default(false),
  condition: z.enum(["new", "used", "refurbished"]),
  city: z.string().min(2),
  state: z.string().length(2),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  images: z.array(z.string()).min(1, "Adicione ao menos uma foto").max(8),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(2000),
});

export const reviewSchema = z.object({
  targetId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(3).max(500),
});
