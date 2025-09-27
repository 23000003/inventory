import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import GradientText from "../ui/gradient-text";

const InventoryHeader : React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <GradientText
            colors={["#c471ed", "#4079ff", "#c471ed", "#4079ff", "#c471ed"]}
            animationSpeed={8}
            showBorder={false}
            className="text-2xl"
          >
            Clarence's Inventory
          </GradientText>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory levels
          </p>
        </div>

      </div>
      <div className="flex items-center gap-6 border-b" />
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md bg-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products by name, description..."
            value=""
            onChange={() => {}}
            className="pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <Button variant="outline" size="sm" className="sm:hidden gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              SORT BY
            </span>
            <Select defaultValue="name">
              <SelectTrigger className="w-40 bg-white cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
                <SelectItem value="created">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">All Products</h2>
          <Badge variant="secondary" className="text-sm">12 of 50 items</Badge>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;