import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import InventoryHeader from "@/components/inventory/inventory-header";
import FilterSidebar from "@/components/inventory/filter-sidebar";
import ProductCard from "@/components/inventory/product-card";

import type { ProductFilter } from "@/types/product";
import useInventory from "@/hooks/useInventory";
import Pagination from "@/components/Pagination";
import type { PaginationType } from "@/types/pagination";

const Inventory = () => {
  const [params, setSearchParams] = useSearchParams();
  
  const searchParams : PaginationType & ProductFilter = useMemo(
    () => ({
      page: parseInt(params.get("page-number") ?? "1"),
      pageSize: parseInt(params.get("page-size") ?? "8"),
      searchTerm: params.get("search-term") ?? "",
      priceRange: params.get("price-range")?.split(",") ?? [],
      sortBy: params.get("sort-by") ?? "",
      category: params.get("category")?.split(",") ?? [],
    }),
    [params],
  );

  const { allProducts, allCategories, isLoading} = useInventory(
    searchParams
  );

  const handlePageAndSizeChange = useCallback((value: string) => {
    // setSearchParams({ page-number: })
  }, [])
  
  if(isLoading) return <h1>Loading...</h1>;

  const viewMode = "grid";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <InventoryHeader
        />

        <div className="flex gap-8 mt-8">
          <aside className="hidden lg:block flex-shrink-0">
            <FilterSidebar 
              allCategories={allCategories}
            />
          </aside>

          {/* Display products */}
          <div className="flex-1 max-w-600 w-600">
            {allProducts?.data?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <div className="text-muted-foreground text-2xl">📦</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {allProducts?.data?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {allProducts?.pagination ? (
                  <Pagination
                    {...allProducts?.pagination}
                  />
                ): null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
