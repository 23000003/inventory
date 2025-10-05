import { api } from "@/config/axios";
import type { CategorySchemaType } from "@/schemas/category.schema";
import type { PaginatedApiResponse } from "@/types/api-response";

const BASE_URL = `/category`;

const CategoryService = {
  getAll: async (query: string | undefined) =>
    api.get<PaginatedApiResponse<CategorySchemaType[]>>(`${BASE_URL}${query ? `?${query}` : ""}`),
};

export default CategoryService;