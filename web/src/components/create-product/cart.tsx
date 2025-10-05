import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Package, ShoppingCart } from "lucide-react";
import type { CreateProductSchemaType } from "@/schemas/product.schema";
import { mockCategories } from "@/data/inventory";
import type { CategorySchemaType } from "@/schemas/category.schema";

interface CreationCartProps {
  products: CreateProductSchemaType[];
  categories: CategorySchemaType[];
  onRemoveProduct: (index: number) => void;
}

export const CreationCart = ({ 
  products, 
  onRemoveProduct,
}: CreationCartProps) => {

  const getCategoryName = (categoryId: number) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  }

  if (products.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Creation List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No products added yet</p>
            <p className="text-sm">Add products using the form to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Creation List
            <Badge variant="default">{products.length}</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={index} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md bg-muted"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(product.category_id)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Qty: {product.quantity}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveProduct(index)}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-primary">
                          ₱{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};