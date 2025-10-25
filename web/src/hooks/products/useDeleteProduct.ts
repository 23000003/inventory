import ProductService from "@/services/product.service";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query";
import { startTransition } from "react";
import { GET_ALL_PRODUCTS_KEY } from "./useGetProducts";
import type { ApiResponse } from "@/types/api-response";
import type { AxiosError } from "axios";
import { GET_ALL_CATEGORIES_KEY } from "../categories/useGetCategories";

type Callback = (message: string) => void;

const deleteProduct = async (productId: number) => {
  const { data } = await ProductService.delete(productId);
  return data;
}

const useDeleteProduct = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-product", options?.deps],
    mutationFn: deleteProduct,
    onSuccess: () => {
      options?.onSuccess?.("Product(s) deleted successfully.");
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_PRODUCTS_KEY]});
        queryClient.invalidateQueries({ queryKey: [GET_ALL_CATEGORIES_KEY]});
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

export default useDeleteProduct;
