import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { mockCategories } from "@/data/inventory";

type PriceRange = {
  min: number;
  max: number;
  label: string;
  count: number;
};

const priceRanges: PriceRange[] = [
  { min: 0, max: 500, label: "₱0 - ₱500", count: 156 },
  { min: 500, max: 1000, label: "₱500 - ₱1,000", count: 234 },
  { min: 1000, max: 2500, label: "₱1,000 - ₱2,500", count: 189 },
  { min: 2500, max: 5000, label: "₱2,500 - ₱5,000", count: 145 },
  { min: 5000, max: 999999, label: "₱5,000+", count: 78 }
];

const FilterSidebar: React.FC = () => {
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visiblePriceRanges = showAllPrices ? priceRanges : priceRanges.slice(0, 3);
  const visibleCategories = showAllCategories ? mockCategories : mockCategories.slice(0, 4);

  return (
    <div className="w-80 space-y-4">
      {/* Active Filters */}
      <Card className="bg-white border-filter-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              ₱500 - ₱1,000
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              Electronics
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card className="bg-white border-filter-border">
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visiblePriceRanges.map((range, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Checkbox id={`price-${index}`} />
              <label
                htmlFor={`price-${index}`}
                className="flex-1 flex items-center justify-between text-sm cursor-pointer"
              >
                <span>{range.label}</span>
                <span className="text-muted-foreground">({range.count})</span>
              </label>
            </div>
          ))}

          {priceRanges.length > 3 && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-primary"
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

      {/* Categories Filter */}
      <Card className="bg-white border-filter-border">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox id={`category-${category.id}`} />
              <label
                htmlFor={`category-${category.id}`}
                className="flex-1 flex items-center justify-between text-sm cursor-pointer"
              >
                <span>{category.name}</span>
                <span className="text-muted-foreground">
                  ({category.number_of_products})
                </span>
              </label>
            </div>
          ))}

          {mockCategories.length > 4 && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-primary"
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
