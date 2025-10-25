import type { CreateProductSchemaType } from "@/schemas/product.schema"
import ProductService from "@/services/product.service";
import type { ApiResponse } from "@/types/api-response";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { startTransition } from "react";
import { GET_ALL_PRODUCTS_KEY } from "./useGetProducts";

type Callback = (message: string) => void;

type UpdateProductPayload = {
  id: number;
  products: CreateProductSchemaType;
};

export const updateProduct = async ({ id, products }: UpdateProductPayload) => {
  const formData = new FormData();

  formData.append("name", products.name);
  formData.append("description", products.description);
  formData.append("price", products.price.toString());
  formData.append("quantity", products.quantity.toString());
  formData.append("category_id", products.category_id.toString());
  // formData.append("image", "");
  formData.append("created_by", products.created_by || "unknown");

  const { data } = await ProductService.update(id, formData);
  return data;
};


const useUpdateProduct = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-product", options?.deps],
    mutationFn: updateProduct,
    onSuccess: () => {
      options?.onSuccess?.("Product(s) updated successfully.");
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_PRODUCTS_KEY]});
      });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      options?.onError?.(
        (Array.isArray(error.response?.data.message)
          ? error.response?.data.message.join(", ")
          : error.response?.data.message) ?? "Something went wrong, please try again",
      );
    },
  });
}

export default useUpdateProduct;