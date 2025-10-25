import type { ApiResponse } from "@/types/api-response";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { startTransition } from "react";
import CategoryService from "@/services/category.service";
import { GET_ALL_CATEGORIES_KEY } from "./useGetCategories";
import { GET_ALL_PRODUCTS_KEY } from "../products/useGetProducts";

type Callback = (message: string) => void;


export const deleteCategory = async (id: number) => {
  const { data } = await CategoryService.delete(id);
  return data;
};

const useDeleteCategory = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-category", options?.deps],
    mutationFn: deleteCategory,
    onSuccess: () => {
      options?.onSuccess?.("Category deleted successfully.");
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_CATEGORIES_KEY]});
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

export default useDeleteCategory;