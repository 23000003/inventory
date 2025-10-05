import type { CreateProductSchemaType } from "@/schemas/product.schema"
import ProductService from "@/services/product.service";
import type { ApiResponse } from "@/types/api-response";
import { useMutation, useQueryClient, type MutationKey } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { startTransition } from "react";
import { GET_ALL_PRODUCTS_KEY } from "./useGetProducts";

type Callback = (message: string) => void;

export const createProduct = async (products: CreateProductSchemaType[]) => {
  const formData = new FormData();

  if(products.length === 1) {
    
    console.log("Creating single product:", products[0]);

    formData.append("name", products[0].name);
    formData.append("description", products[0].description);
    formData.append("price", products[0].price.toString());
    formData.append("quantity", products[0].quantity.toString());
    formData.append("category_id", products[0].category_id.toString());
    formData.append("image", products[0].image);
    formData.append("created_by", products[0].created_by || "unknown");

    const { data } = await ProductService.create(formData);
    return data;

  } else {
    console.log("Creating multiple products:", products);
    products.forEach((product, index) => {
      formData.append(`req[${index}].name`, product.name);
      formData.append(`req[${index}].description`, product.description);
      formData.append(`req[${index}].price`, product.price.toString());
      formData.append(`req[${index}].quantity`, product.quantity.toString());
      formData.append(`req[${index}].category_id`, product.category_id.toString());
      formData.append(`req[${index}].image`, product.image);
      formData.append(`req[${index}].created_by`, product.created_by);
    });
    
    const { data } = await ProductService.createBulk(formData);
    return data;
  }
};


const useCreateProduct = (options?: {
  deps?: MutationKey;
  onSuccess?: Callback;
  onError?: Callback;
}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-product", options?.deps],
    mutationFn: createProduct,
    onSuccess: () => {
      options?.onSuccess?.("Product(s) created successfully.");
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_PRODUCTS_KEY]});
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

export default useCreateProduct;