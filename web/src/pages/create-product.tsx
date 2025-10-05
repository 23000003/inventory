import { useState } from "react";
import type { CreateProductSchemaType } from "@/schemas/product.schema";
import { CreateProductHeader } from "@/components/create-product/header";
import { ProductForm } from "@/components/create-product/form";
import { CreationCart } from "@/components/create-product/cart";
import useGetCategories from "@/hooks/categories/useGetCategories";
import useCreateProduct from "@/hooks/products/useCreateProduct";
import { toastr } from "@/utils/toast";

const CreateProducts = () => {
  const [productsToCreate, setProductsToCreate] = useState<CreateProductSchemaType[]>([]);

  const { data: allCategories } = useGetCategories();

  const { mutate: createProducts, isPending } = useCreateProduct({
    onSuccess: (message) => {
      toastr.success(message);
      setProductsToCreate([]);
      clearAll();
    },
    onError: (message) => {
      toastr.error(message || "Failed to create products.");
      console.error("Error creating products:", message);
    },
  });

  const addProduct = (product: CreateProductSchemaType) => {
    setProductsToCreate(prev => [...prev, product]);
  };

  const removeProduct = (index: number) => {
    setProductsToCreate(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setProductsToCreate([]);
  };

  const handleCreateAll = () => {
    if (productsToCreate.length === 0) return;
    createProducts(productsToCreate);
  };

  return (
    <div className="min-h-screen bg-background">
      <CreateProductHeader
        totalProducts={productsToCreate.length}
        onCreateAll={handleCreateAll}
        onClearAll={clearAll}
        isPending={isPending}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
              <ProductForm 
                onAddProduct={addProduct} 
                categories={allCategories || []} 
              />
            </div>
          </div>
          <div className="space-y-6">
            <CreationCart
              products={productsToCreate}
              onRemoveProduct={removeProduct}
              categories={allCategories || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;