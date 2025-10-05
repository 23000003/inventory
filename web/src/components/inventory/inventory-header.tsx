import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import GradientText from "../ui/gradient-text";
import { useUserStore } from "@/stores/useUserStore";
import { InventorySortByRequest } from "@/types/inventory.d";

type Props = {
  totalCount: number;
  pageSize: number;
  handleSortChange: (sortBy: string) => void;
  handleDebouncedSearch: (searchTerm: string) => void;
}

const SORT_BY_OPTIONS = [
  { value: InventorySortByRequest.NAME_ASC, label: "Name A-Z" },
  { value: InventorySortByRequest.NAME_DESC, label: "Name Z-A" },
  { value: InventorySortByRequest.PRICE_ASC, label: "Price Low to High" },
  { value: InventorySortByRequest.PRICE_DESC, label: "Price High to Low" },
  { value: InventorySortByRequest.STOCK_ASC, label: "Lowest Stock" },
  { value: InventorySortByRequest.STOCK_DESC, label: "Highest Stock" },
  { value: InventorySortByRequest.CREATED_AT_DESC, label: "Oldest Added" },
  { value: InventorySortByRequest.CREATED_AT_ASC, label: "Recently Added" },
];

const InventoryHeader: React.FC<Readonly<Props>> = ({ 
  pageSize,
  totalCount,
  handleSortChange,
  handleDebouncedSearch,
}) => {

  const { user } = useUserStore();

  const debounce = (onChange: (value: string) => void) => {
    let timeout: NodeJS.Timeout;
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const form = e.currentTarget.value;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 1000);
    };
  };

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
            Welcome back, {user?.username}!
          </GradientText>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory levels
          </p>
        </div>

      </div>
      <div className="flex items-center gap-6 border-b" />
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md bg-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products by name, description..."
            onChange={debounce((e) => {
              handleDebouncedSearch(e);
            })}
            className="pl-10"
          />
        </div>
        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            className="sm:hidden gap-2 bg-white cursor-pointer font-normal"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              SORT BY
            </span>
            <Select defaultValue={InventorySortByRequest.CREATED_AT_ASC} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40 bg-white cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_BY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">All Products</h2>
          <Badge variant="default" className="text-sm">
            {(pageSize < totalCount ? pageSize : totalCount)} of {totalCount} item/s
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;