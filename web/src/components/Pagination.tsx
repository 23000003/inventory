import type { PaginationDetails } from "@/types/pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Pagination : React.FC<Readonly<PaginationDetails>> = ({
    pageNumber,
    totalPages,
    pageSize,
    totalPageSize,
    hasNext,
    hasPrevious
}) => {

    // const index = pageNumber - 1;

    return (
        totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => {}}
                disabled={!hasPrevious}
                className="gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
    
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => {}}
                    className="w-8 h-8 p-0 cursor-pointer"
                  >
                    {page}
                  </Button>
                ))}
              </div>
    
              <Button
                variant="outline"
                onClick={() => {}}
                disabled={!hasNext}
                className="gap-2 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )
    )
}

export default Pagination;