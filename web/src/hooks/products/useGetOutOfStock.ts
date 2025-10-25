import ProductService from "@/services/product.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export const GET_ALL_PRODUCTS_QUANTITY_KEY = "out-of-stock-products-quantity";

export const getAllProductsQuantityRequest = async () =>  {
  const { data } = await ProductService.getOutOfStockQuantity();
  return data.data;
}

const useGetOutOfStock = (
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [GET_ALL_PRODUCTS_QUANTITY_KEY],
    queryFn: () => getAllProductsQuantityRequest(),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}

export default useGetOutOfStock;