import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Pencil, Eye } from "lucide-react";
import React, { useState } from "react";
import type { ProductSchemaType } from "@/schemas/product.schema";
import ProductModal from "./product-modal";
import { InventoryProductActions } from "@/types/inventory.d";
import type { CategorySchemaType } from "@/schemas/category.schema";

interface Props {
  product: ProductSchemaType;
  categories: CategorySchemaType[];
}

const ProductCard: React.FC<Props> = ({ 
  product, 
  categories 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<InventoryProductActions | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const getStockStatus = () => {
    const qty = parseInt(product.quantity);
    if (qty === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (qty < 10) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group relative overflow-hidden bg-product-card border-product-card-border hover:bg-product-card-hover hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0 bg-white">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(error) => {
                console.log("Image failed to load:", error);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 rounded-full shadow-lg cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => setIsModalOpen(InventoryProductActions.EDIT)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 rounded-full shadow-lg cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => setIsModalOpen(InventoryProductActions.VIEW)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute top-3 left-3">
            <Badge variant={stockStatus.variant} className="text-xs">
              {stockStatus.label}
            </Badge>
          </div>
          
        </div>
        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Qty: {product.quantity}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-price-primary">
              ₱{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
      <ProductModal
        product={product}
        categories={categories}
        isEditing={isEditing}
        imageError={imageError}
        isModalOpen={isModalOpen}
        setIsEditing={setIsEditing}
        setImageError={setImageError}
        editedProduct={editedProduct}
        setIsModalOpen={setIsModalOpen}
        setEditedProduct={setEditedProduct}
      />
    </Card>
  );
};

export default ProductCard;