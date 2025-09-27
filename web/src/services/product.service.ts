import { api } from "@/config/axios";
import type { ProductSchemaType } from "@/schemas/product.schema";
import type { ApiResponse } from "@/types/api-response";

const BASE_URL = `/products`;

const ProductService = {
  getAll: (query: string) =>
    api.get<ApiResponse<ProductSchemaType[]>>(`${BASE_URL}${query}`),
};

export default ProductService;