import { api } from "@/config/axios";
import type { ProductSchemaType } from "@/schemas/product.schema";
import type { ApiResponse, PaginatedApiResponse } from "@/types/api-response";

const BASE_URL = `/products`;

const ProductService = {
  getAll: async (query: string) =>
    api.get<PaginatedApiResponse<ProductSchemaType[]>>(`${BASE_URL}${query}`),
  getOutOfStockQuantity: async () =>
    api.get<ApiResponse<ProductSchemaType[]>>(`${BASE_URL}/out-of-stock`),
  create: async (formData: FormData) =>
    api.post<ApiResponse<string>>(`${BASE_URL}/create-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  createBulk: async (formData: FormData) =>
    api.post<ApiResponse<string>>(`${BASE_URL}/create-products-bulk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: async (productId: number, formData: FormData) =>
    api.put<ApiResponse<string>>(`${BASE_URL}/update-product/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: async (productId: number) =>
    api.delete<ApiResponse<string>>(`${BASE_URL}/delete-product/${productId}`),
};

export default ProductService;