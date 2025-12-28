import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import InventoryHeader from "@/components/inventory/inventory-header";
import FilterSidebar from "@/components/inventory/filter-sidebar";
import ProductCard from "@/components/inventory/products/product-card";
import type { ProductFilter } from "@/types/product";
import type { PaginationType } from "@/types/pagination";
import useGetProducts from "@/hooks/products/useGetProducts";
import useGetCategories from "@/hooks/categories/useGetCategories";
import Pagination from "@/components/Pagination";

const VIEW_MODE = "grid";

const Inventory = () => {
  const [params, setSearchParams] = useSearchParams();

  const searchParams : PaginationType & ProductFilter = useMemo(
    () => ({
      page: parseInt(params.get("page-number") ?? "1"),
      pageSize: parseInt(params.get("page-size") ?? "8"),
      search: params.get("search") ?? "",
      priceRange: params.get("price-range")?.split(",") ?? [],
      sortBy: params.get("sort-by") ?? "",
      category: params.get("category")?.split(",") ?? [],
    }),
    [params],
  );

  const { 
    data: allProducts, 
    isLoading: productLoading, 
    error: productError 
  } = useGetProducts(
    searchParams
  );

  const { 
    data: allCategories, 
    isLoading: categoryLoading, 
    error: categoryError 
  } = useGetCategories();

  const handleSidebarFilterChange = useCallback((newFilters: ProductFilter) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        // convert camelCase to kebab-case
        const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); 
        if (Array.isArray(value)) {
          if (value.length) {
            newParams.set(kebabKey, value.join(","));
          } else {
            newParams.delete(kebabKey);
          }
        } else if (value) {
          newParams.set(kebabKey, value);
        } else {
          newParams.delete(kebabKey);
        }
      });
      newParams.set("page-number", "1");
      return newParams;
    });
  }, [setSearchParams]);

  const handlePageAndSizeChange = useCallback((
    type: "page" | "size", 
    value: number
  ) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (type === "page") {
        newParams.set("page-number", value.toString());
      } else {
        newParams.set("page-size", value.toString());
      }
      return newParams;
    });
  }, [setSearchParams]);

  const handleSortChange = useCallback((sortBy: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
        if (sortBy) {
          newParams.set("sort-by", sortBy);
        }
      return newParams;
    });
  }, [setSearchParams]);

  const handleSearch = useCallback((value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value.trim()) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      newParams.set("page-number", "1");
      return newParams;
    });
  }, [setSearchParams]);

  if(productLoading || categoryLoading) return <h1>Loading...</h1>;
  if(productError || categoryError) return <h1>Error loading products or categories</h1>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <InventoryHeader
          totalCount={allProducts?.pagination?.totalCount || 0}
          pageSize={allProducts?.pagination?.pageSize || 0}
          handleSortChange={handleSortChange}
          handleDebouncedSearch={handleSearch}
        />
        <div className="flex gap-8 mt-8">
          <aside className="hidden lg:block flex-shrink-0">
            <FilterSidebar 
              allCategories={allCategories}
              handleSidebarFilterChange={handleSidebarFilterChange}
              currentFilters={{
                category: searchParams.category,
                priceRange: searchParams.priceRange,
                search: searchParams.search,
                sortBy: searchParams.sortBy
              }}
            />
          </aside>
          {/* Display products */}
          <div className="flex-1 w-[400px] sm:max-w-600 sm:w-600">
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
                    VIEW_MODE === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {allProducts?.data?.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      categories={allCategories ?? []}
                    />
                  ))}
                </div>

                {allProducts?.pagination ? (
                  <Pagination
                    {...allProducts?.pagination}
                    handlePageAndSizeChange={handlePageAndSizeChange}
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
