import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { CategorySchemaType } from "@/schemas/category.schema";
import type { ProductFilter } from "@/types/product";
// import { mockCategories } from "@/data/inventory";

type Props = {
  allCategories: CategorySchemaType[] | undefined;
  handleSidebarFilterChange: (newFilters: ProductFilter) => void;
  currentFilters: ProductFilter;
}

type PriceRange = {
  min: number;
  max: number;
  label: string;
};

const priceRanges: PriceRange[] = [
  { min: 0, max: 500, label: "₱0 - ₱500" },
  { min: 500, max: 1000, label: "₱500 - ₱1,000" },
  { min: 1000, max: 2500, label: "₱1,000 - ₱2,500" },
  { min: 2500, max: 5000, label: "₱2,500 - ₱5,000" },
  { min: 5000, max: 999999, label: "₱5,000+" }
];

const FilterSidebar: React.FC<Readonly<Props>> = ({ 
  allCategories,
  handleSidebarFilterChange,
  currentFilters
}) => {
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visiblePriceRanges = showAllPrices ? priceRanges : priceRanges.slice(0, 3);
  const visibleCategories = showAllCategories ? allCategories : allCategories?.slice(0, 4);

  return (
    <div className="w-80 space-y-4">
      
      {currentFilters.category?.length || currentFilters.priceRange?.length ? (
        <Card className="bg-white border-filter-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs h-auto py-1 px-3 cursor-pointer"
                onClick={() => {
                  handleSidebarFilterChange({
                    category: [],
                    priceRange: [],
                    search: "",
                    sortBy: ""
                  });
                }}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {currentFilters.priceRange?.map((range) => {
                const priceRangeData = priceRanges.find(pr => `${pr.min}-${pr.max}` === range);
                return (
                  <Badge 
                    key={range} 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => {
                      const newPriceRanges = currentFilters.priceRange?.filter(pr => pr !== range) || [];
                      handleSidebarFilterChange({ priceRange: newPriceRanges });
                    }}
                  >
                    {priceRangeData?.label || range}
                    <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
                  </Badge>
                );
              })}
              {currentFilters.category?.map((categoryName) => (
                <Badge 
                  key={categoryName} 
                  variant="outline" 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    const newCategories = currentFilters.category?.filter(cat => cat !== categoryName) || [];
                    handleSidebarFilterChange({ category: newCategories });
                  }}
                >
                  <X className="w-3 h-3 hover:text-destructive" />
                  {categoryName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null }

      <Card className="bg-white border-filter-border">
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visiblePriceRanges.map((range, index) => {
            const rangeKey = `${range.min}-${range.max}`;
            const isChecked = currentFilters.priceRange?.includes(rangeKey) || false;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox 
                  id={`price-${index}`} 
                  checked={isChecked}
                  className="cursor-pointer hover:bg-gray-200"
                  onCheckedChange={(checked) => {
                    const currentPriceRanges = currentFilters.priceRange || [];
                    const newPriceRanges = checked
                      ? [...currentPriceRanges, rangeKey]
                      : currentPriceRanges.filter(pr => pr !== rangeKey);
                    
                    handleSidebarFilterChange({
                      priceRange: newPriceRanges,
                    });
                  }}
                />
                <label
                  htmlFor={`price-${index}`}
                  className="flex-1 flex items-center justify-between text-sm cursor-pointer"
                >
                  <span>{range.label}</span>
                </label>
              </div>
            );
          })}
          {priceRanges.length > 3 && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-primary cursor-pointer"
                onClick={() => setShowAllPrices((prev) => !prev)}
              >
                {showAllPrices ? "Show Less" : "Show More"}
                {showAllPrices ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-filter-border">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleCategories?.map((category) => {
            const isChecked = currentFilters.category?.includes(category.name) || false;
            
            return (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox 
                  id={`category-${category.id}`}
                  className="cursor-pointer hover:bg-gray-200"
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const currentCategories = currentFilters.category || [];
                    const newCategories = checked
                      ? [...currentCategories, category.name]
                      : currentCategories.filter(cat => cat !== category.name);
                    
                    handleSidebarFilterChange({
                      category: newCategories,
                    });
                  }}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="flex-1 flex items-center justify-between text-sm cursor-pointer"
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">
                    ({category.numberOfProducts})
                  </span>
                </label>
              </div>
            );
          })}
          {(allCategories?.length || 0) > 4 && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-primary cursor-pointer"
                onClick={() => setShowAllCategories((prev) => !prev)}
              >
                {showAllCategories ? "Show Less" : "Show More"}
                {showAllCategories ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
