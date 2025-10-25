import { z } from "zod";
// import { ProductSchema } from "./product.schema";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  numberOfProducts: z.string(),
  createdBy: z.string(),
  createdDate: z.coerce
    .string({
        required_error: "Created date is required.",
        invalid_type_error: "Created Date is required.",
    })
    .datetime(),
  // Products: z.array(ProductSchema),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required." }),
  created_by: z.string().min(1, { message: "Created by is required." }),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type CategorySchemaType = z.infer<typeof CategorySchema>;
