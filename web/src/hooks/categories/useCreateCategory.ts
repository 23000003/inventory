import type { ApiResponse } from "@/types/api-response";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { startTransition } from "react";
import type { CreateCategorySchemaType } from "@/schemas/category.schema";
import CategoryService from "@/services/category.service";
import { GET_ALL_CATEGORIES_KEY } from "./useGetCategories";

type Callback = (message: string) => void;

export const createCategory = async (category: CreateCategorySchemaType) => {
  const { data } = await CategoryService.create(category);
  return data;
};


const useCreateCategory = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-category", options?.deps],
    mutationFn: createCategory,
    onSuccess: () => {
      options?.onSuccess?.("Category created successfully.");
      startTransition(() => {
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

export default useCreateCategory;