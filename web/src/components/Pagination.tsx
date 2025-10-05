import type { PaginationDetails } from "@/types/pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Select, 
  SelectItem, 
  SelectTrigger, 
  SelectContent, 
  SelectGroup, 
  SelectValue  
} from "./ui/select";

type PaginationProps = PaginationDetails & {
  handlePageAndSizeChange: (type: "page" | "size", value: number) => void;
};

const options = [
  { value: 8, label: "8" },
  { value: 16, label: "16" },
  { value: 24, label: "24" },
  { value: 32, label: "32" },
]

const Pagination : React.FC<Readonly<PaginationProps>> = ({
    pageNumber,
    totalPages,
    pageSize,
    hasNext,
    hasPrevious,
    handlePageAndSizeChange
}) => {

  const getVisiblePageNumbers = () => {

    const visiblePages: number[] = [];
    const maximumPagesToShow = 4;

    let start = Math.max(1, pageNumber - Math.floor(maximumPagesToShow / 2));
    let end = start + maximumPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maximumPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="flex items-center justify-between mt-12">
      <div className="flex items-center gap-x-2">
        <div className="flex-1 truncate text-sm text-muted-foreground">
          Rows <span className="hidden sm:inline">per page</span>
        </div>
        <div className="w-20">
          <Select
            value={pageSize.toString()}
            onValueChange={(value: string) => {
              handlePageAndSizeChange("size", parseInt(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {totalPages >= 1 && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => handlePageAndSizeChange("page", pageNumber - 1)}
            disabled={!hasPrevious}
            className="gap-2 cursor-pointer bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="hidden items-center gap-2 sm:flex">
            {getVisiblePageNumbers().map((page) => (
              <Button
                key={page}
                variant={page === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageAndSizeChange("page", page)}
                className="w-8 h-8 p-0 cursor-pointer"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageAndSizeChange("page", pageNumber + 1)}
            disabled={!hasNext}
            className="gap-2 cursor-pointer bg-white"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Pagination;