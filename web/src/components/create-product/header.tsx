import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

interface CreateHeaderProps {
  totalProducts: number;
  onCreateAll: () => void;
  onClearAll: () => void;
  isPending: boolean;
}

export const CreateProductHeader: React.FC<CreateHeaderProps> = ({ 
  totalProducts, 
  onCreateAll, 
  onClearAll, 
  isPending 
}) => {
  return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClearAll}
              disabled={totalProducts === 0}
              className="text-destructive bg-white hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button 
              onClick={onCreateAll} 
              className="bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={totalProducts === 0 || isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isPending ? "Creating..." : "Create Product/s"}
            </Button>
          </div>
        </div>
      </div>
  );
};