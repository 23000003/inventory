import CategoryService from "@/services/category.service";
import ProductService from "@/services/product.service";
import type { Pagination } from "@/types/pagination";
import type { ProductFilter } from "@/types/product";
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";

export const GET_ALL_CATEGORIES_KEY = "inventory";
export const GET_ALL_PRODUCTS_KEY = "products";

export const getAllProductsRequest = async (params: ProductFilter & Pagination) => {
  const { page, pageSize, category, priceRange, searchTerm, sortBy } = params;

  let query = "";

  if (page) query += `page=${encodeURIComponent(page)}&`;
  if (pageSize) query += `pageSize=${encodeURIComponent(pageSize)}&`;
  if (category?.length) query += `category=${category.map(encodeURIComponent).join(",")}&`;
  if (priceRange?.length) query += `priceRange=${priceRange.map(encodeURIComponent).join(",")}&`;
  if (searchTerm) query += `searchTerm=${encodeURIComponent(searchTerm)}&`;
  if (sortBy) query += `sortBy=${encodeURIComponent(sortBy)}&`;

  query = query.endsWith("&") || query.endsWith("?") ? query.slice(0, -1) : query;

  const { data } = await ProductService.getAll(query);

  return data;
};


const useInventory = (
  params: Pagination & ProductFilter,
  options?: { deps?: QueryKey; enabled?: boolean },
) => {
  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: [GET_ALL_PRODUCTS_KEY, options?.deps],
    queryFn: () => getAllProductsRequest(params),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });

  const { data: allCategoryNames, isLoading: namesLoading } = useQuery({
    queryKey: [GET_ALL_CATEGORIES_KEY],
    queryFn: () => CategoryService.getAllNamesOnly(),
    select: (data) => data.data,
  });

  return { 
    allProducts, 
    allCategoryNames, 
    isLoading: productsLoading || namesLoading 
  };
}

export default useInventory;
