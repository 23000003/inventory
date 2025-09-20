import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  quantity: z.string(),
  image: z.string(),
  created_by: z.string(),
  created_date: z.coerce
    .string({
        required_error: "Created date is required.",
        invalid_type_error: "Created Date is required.",
    })
    .datetime(),
  category_id: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    number_of_products: z.string(),
    created_by: z.string(),
    created_date: z.date(),
  }),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
