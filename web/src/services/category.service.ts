import { api } from "@/config/axios";
import type { CategorySchemaType, CreateCategorySchemaType } from "@/schemas/category.schema";
import type { PaginatedApiResponse } from "@/types/api-response";

const BASE_URL = `/category`;

const CategoryService = {
  getAll: async (query: string | undefined) =>
    api.get<PaginatedApiResponse<CategorySchemaType[]>>(`${BASE_URL}${query ? `?${query}` : ""}`),
  create: async (data: CreateCategorySchemaType) =>
    api.post<CategorySchemaType>(`${BASE_URL}/create-category`, data),
  update: async (categoryId: number, data: CreateCategorySchemaType) =>
    api.patch<CategorySchemaType>(`${BASE_URL}/update-category/${categoryId}`, data),
  delete: async (categoryId: number) =>
    api.delete<{ message: string }>(`${BASE_URL}/delete-category/${categoryId}`),
};

export default CategoryService;