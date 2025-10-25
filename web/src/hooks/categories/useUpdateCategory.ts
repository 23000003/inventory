import type { ApiResponse } from "@/types/api-response";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { startTransition } from "react";
import type { CreateCategorySchemaType } from "@/schemas/category.schema";
import CategoryService from "@/services/category.service";
import { GET_ALL_CATEGORIES_KEY } from "./useGetCategories";

type Callback = (message: string) => void;

type UpdateCategoryPayload = {
  id: number;
  category: CreateCategorySchemaType;
};

export const updateCategory = async ({ id, category }: UpdateCategoryPayload) => {
  const { data } = await CategoryService.update(id, category);
  return data;
};

const useUpdateCategory = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-category", options?.deps],
    mutationFn: updateCategory,
    onSuccess: () => {
      options?.onSuccess?.("Category updated successfully.");
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

export default useUpdateCategory;