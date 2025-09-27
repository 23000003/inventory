import { api } from "@/config/axios";
import type { CategorySchemaType } from "@/schemas/category.schema";
import type { ApiResponse } from "@/types/api-response";

const BASE_URL = `/category`;

const CategoryService = {
  getAll: () => // apply pagination
    api.get<ApiResponse<CategorySchemaType[]>>(`${BASE_URL}`),
};

export default CategoryService;