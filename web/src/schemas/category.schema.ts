import { z } from "zod";
import { ProductSchema } from "./product.schema";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  number_of_products: z.string(),
  created_by: z.string(),
  created_date: z.coerce
    .string({
        required_error: "Created date is required.",
        invalid_type_error: "Created Date is required.",
    })
    .datetime(),
  Products: z.array(ProductSchema),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
