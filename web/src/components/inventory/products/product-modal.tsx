import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ProductSchemaType } from '@/schemas/product.schema';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { InventoryProductActions } from '@/types/inventory.d';
import type { CategorySchemaType } from '@/schemas/category.schema';
import { DeleteProductModal, EditProductModal } from './product-actions';

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
      isModalOpen === InventoryProductActions.EDIT ? (
        <EditProductModal
          isEditing={isEditing}
          product={product}
          categories={categories}
          imageError={imageError}
          editedProduct={editedProduct}
          setIsEditing={setIsEditing}
          setImageError={setImageError}
          setEditedProduct={setEditedProduct}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      ) : (
        isModalOpen === InventoryProductActions.DELETE ? (
          <DeleteProductModal
            isEditing={isEditing}
            product={product}
            categories={categories}
            imageError={imageError}
            editedProduct={editedProduct}
            setIsEditing={setIsEditing}
            setImageError={setImageError}
            setEditedProduct={setEditedProduct}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : null
      )
    )
  )
}

export default ProductModal;