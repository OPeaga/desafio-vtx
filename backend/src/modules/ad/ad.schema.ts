import { z } from "zod";

export const createAdSchema = z
  .object({
    title: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
    description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres"),
    type: z.enum(["venda", "doacao"]),
    price: z.number().nullable().optional(),
    categoryId: z.number().int().positive(),
    imageUrl: z.url().nullable().optional(),
  })
  .refine((data) => (data.type === "doacao" ? data.price == null : true), {
    message: "Anúncio de doação não pode ter preço",
    path: ["price"],
  })
  .refine((data) => (data.type === "venda" ? data.price != null && data.price > 0 : true), {
    message: "Anúncio de venda precisa de um preço maior que zero",
    path: ["price"],
  });

export const adFiltersSchema = z.object({
  category: z.string().optional(),
  type: z.enum(["venda", "doacao"]).optional(),
  search: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export type CreateAdInput = z.infer<typeof createAdSchema>;
export type AdFilters = z.infer<typeof adFiltersSchema>;
