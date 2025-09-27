import CategoryService from "@/services/category.service";
import ProductService from "@/services/product.service";
import type { PaginationType } from "@/types/pagination";
import type { ProductFilter } from "@/types/product";
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";

export const GET_ALL_CATEGORIES_KEY = "inventory";
export const GET_ALL_PRODUCTS_KEY = "products";

export const getAllProductsRequest = async (params: ProductFilter & PaginationType) => {
  const { page, pageSize, category, priceRange, searchTerm, sortBy } = params;

  let query = "?";

  if (page) query += `page-number=${encodeURIComponent(page)}&`;
  if (pageSize) query += `page-size=${encodeURIComponent(pageSize)}&`;
  if (category?.length) query += `category=${category.map(encodeURIComponent).join(",")}&`;
  if (priceRange?.length) query += `price-range=${priceRange.map(encodeURIComponent).join(",")}&`;
  if (searchTerm) query += `search-term=${encodeURIComponent(searchTerm)}&`;
  if (sortBy) query += `sort-by=${encodeURIComponent(sortBy)}&`;

  query = query.endsWith("&") || query.endsWith("?") ? query.slice(0, -1) : query;

  const { data } = await ProductService.getAll(query);

  return data;
};


const useInventory = (
  params: PaginationType & ProductFilter,
  options?: { deps?: QueryKey; enabled?: boolean },
) => {
  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: [GET_ALL_PRODUCTS_KEY, options?.deps],
    queryFn: () => getAllProductsRequest(params),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });

  const { data: allCategories, isLoading: namesLoading } = useQuery({
    queryKey: [GET_ALL_CATEGORIES_KEY],
    queryFn: () => CategoryService.getAll(),
    select: (data) => data.data.data,
  });

  console.log(allCategories, allProducts);

  return { 
    allProducts, 
    allCategories, 
    isLoading: productsLoading || namesLoading 
  };
}

export default useInventory;
