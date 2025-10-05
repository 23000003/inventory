import React from 'react'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductSchemaType } from '@/schemas/product.schema';
import { Button } from '../ui/button';
import { Edit, ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { InventoryProductActions } from '@/types/inventory.d';
import type { CategorySchemaType } from '@/schemas/category.schema';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';

type Props = {
  imageError: boolean;
  isEditing: boolean;
  product: ProductSchemaType;
  categories: CategorySchemaType[];
  editedProduct: ProductSchemaType;
  isModalOpen: InventoryProductActions | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setImageError: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedProduct: React.Dispatch<React.SetStateAction<ProductSchemaType>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<InventoryProductActions | null>>;
}

const ProductModal: React.FC<Readonly<Props>> = ({
  product,
  isEditing,
  categories,
  imageError,
  isModalOpen,
  setIsEditing,
  setImageError,
  editedProduct,
  setIsModalOpen,
  setEditedProduct,
}) => {

  console.log(editedProduct)

  return (
    isModalOpen === InventoryProductActions.VIEW ? (
      <Dialog open={isModalOpen != null} onOpenChange={() => setIsModalOpen(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information about {product.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-lg">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Product Name</p>
                <p className="text-lg font-semibold">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{product.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                  <p className="text-lg font-bold text-price-primary">{product.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Quantity</p>
                  <p className="text-lg font-semibold">{product.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                  <Badge variant="default">{product.category.name}</Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    ) : (
      <Dialog open={isModalOpen != null} onOpenChange={(open) => {
        setIsModalOpen(open ? isModalOpen : null);
        if (!open) {
          setIsEditing(false);
          setEditedProduct(product);
        }
      }}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className='space-y-1'>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Make changes to {product.name}
                </DialogDescription>
              </div>
              <Button
                size="sm"
                variant="default"
                onClick={() => setIsEditing(!isEditing)}
                className='mr-6 cursor-pointer'
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-lg">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Product Name</p>
                {isEditing ? (
                  <Input
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, name: e.target.value 
                    })}
                  />
                ) : (
                  <p className="text-lg font-semibold">{editedProduct.name}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                {isEditing ? (
                  <Textarea
                    value={editedProduct.description}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, description: e.target.value
                    })}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">{editedProduct.description}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                  {isEditing ? (
                    <Input
                      value={editedProduct.price}
                      type="number"
                      onChange={(e) => setEditedProduct({ 
                        ...editedProduct, price: Number(e.target.value) 
                      })}
                    />
                  ) : (
                    <p className="text-lg font-bold text-price-primary">{editedProduct.price}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Quantity</p>
                  {isEditing ? (
                    <Input
                      value={editedProduct.quantity}
                      onChange={(e) => setEditedProduct({ 
                        ...editedProduct, quantity: e.target.value 
                      })}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{editedProduct.quantity}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                  {isEditing ? (
                    <Select
                      value={editedProduct.categoryId.toString()}
                      onValueChange={(val) => {
                        const categoryId = Number(val);
                        const selectedCategory = categories.find(cat => cat.id === categoryId);

                        if (selectedCategory) {
                          setEditedProduct({
                            ...editedProduct,
                            categoryId: categoryId,
                            category: selectedCategory,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1" disabled>Select a category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="default">{editedProduct.category.name}</Badge>
                  )}
                </div>
              </div>
            </div>
            {isEditing && (
              <Button className="w-full cursor-pointer" onClick={() => {
                // Handle save logic here
                setIsEditing(false);
                console.log("Saved:", editedProduct);
              }}>
                Save Changes
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  )
}

export default ProductModal;