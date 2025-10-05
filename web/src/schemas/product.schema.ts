import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.string(),
  image: z.string(),
  createdBy: z.string(),
  createdDate: z.coerce
    .string({
        required_error: "Created date is required.",
        invalid_type_error: "Created Date is required.",
    })
    .datetime(),
  categoryId: z.number(),
  category: z.object({
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
  }),
});

export const CreateProductSchema = z.object({
  name: z.string()
    .min(1, 
      { message: "Product name is required." }
    ),
  description: z.string()
    .min(1, 
      { message: "Product description is required." }
    ),
  price: z.number({
      required_error: "Product price is required.",
      invalid_type_error: "Price must be a number.",
    })
    .min(1, { message: "Product price must be at least ₱1.00." })
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      { message: "Price must have up to two decimal places." }
    ),
  quantity: z.number()
    .min(1, 
      { message: "Product quantity is required." }
    ),
  category_id: z.number()
    .min(0,
      { message: "Category is required." }
    ),
  created_by: z.string()
    .min(1, 
      { message: "Created by is required." }
    ),
  image: z.instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
