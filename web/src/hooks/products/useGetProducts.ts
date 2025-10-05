import ProductService from "@/services/product.service";
import type { PaginationType } from "@/types/pagination";
import type { ProductFilter } from "@/types/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const GET_ALL_PRODUCTS_KEY = "products";

export const getAllProductsRequest = async (
  params: ProductFilter & PaginationType
) =>  {
  const { page, pageSize, category, priceRange, search, sortBy } = params;

  let query = "?";

  if (page) query += `page-number=${encodeURIComponent(page)}&`;
  if (pageSize) query += `page-size=${encodeURIComponent(pageSize)}&`;
  if (category?.length) query += `category=${category.map(encodeURIComponent).join(",")}&`;
  if (priceRange?.length) query += `price-range=${priceRange.map(encodeURIComponent).join(",")}&`;
  if (search) query += `search=${encodeURIComponent(search)}&`;
  if (sortBy) query += `sort-by=${encodeURIComponent(sortBy)}&`;

  query = query.endsWith("&") || query.endsWith("?") ? query.slice(0, -1) : query;

  const { data } = await ProductService.getAll(query);

  return data;
};


const useGetProducts = (
  params: PaginationType & ProductFilter, 
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [GET_ALL_PRODUCTS_KEY, params],
    queryFn: () => getAllProductsRequest(params),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}

export default useGetProducts;