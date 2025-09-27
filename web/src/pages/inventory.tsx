import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import InventoryHeader from "@/components/inventory/inventory-header";
import FilterSidebar from "@/components/inventory/filter-sidebar";
import ProductCard from "@/components/inventory/product-card";

import { mockProducts } from "@/data/inventory";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/types/pagination";
import type { ProductFilter } from "@/types/product";

const Inventory = () => {
  const [params, setSearchParams] = useSearchParams();

  const searchParams : Pagination & ProductFilter = useMemo(
    () => ({
      page: parseInt(params.get("page") ?? "1"),
      pageSize: parseInt(params.get("pageSize") ?? "12"),
      searchTerm: params.get("search") ?? "",
      priceRange: params.get("priceRange")?.split(",") ?? [],
      sortBy: params.get("sortBy") ?? "",
      category: params.get("category")?.split(",") ?? [],
    }),
    [params],
  );

  const viewMode = "grid";
  const filteredProducts = mockProducts.slice(0, 12); 
  const paginatedProducts = filteredProducts; 
  const currentPage = 1;
  const totalPages = 3;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <InventoryHeader
 
        />

        <div className="flex gap-8 mt-8">
          <aside className="hidden lg:block flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Display products */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
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
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => {}}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => {}}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {}}
                      // disabled={true}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
