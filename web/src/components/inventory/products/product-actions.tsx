import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useUserStore } from '@/stores/useUserStore';
import { Form, FormControl, FormField, FormItem,  FormMessage } from '../../ui/form';
import useUpdateProduct from '@/hooks/products/useUpdateProduct';
import { toastr } from '@/utils/toast';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import useDeleteProduct from '@/hooks/products/useDeleteProduct';
import { CreateProductSchema, type CreateProductSchemaType, type ProductSchemaType } from '@/schemas/product.schema';
import type { CategorySchemaType } from '@/schemas/category.schema';
import type { InventoryProductActions } from '@/types/inventory.d';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from 'react';
import { Edit, ShoppingCart } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useQueryClient } from '@tanstack/react-query';
import { GET_ALL_PRODUCTS_QUANTITY_KEY } from '@/hooks/products/useGetOutOfStock';


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

export const EditProductModal: React.FC<Props> = ({
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

  const queryClient = useQueryClient();

  const { user } = useUserStore();

  const [imagePreview, setImagePreview] = useState<string>(product.image);

  const { mutate: updateProducts, isPending } = useUpdateProduct({
    onSuccess: (message) => {
      if(product.quantity === 0) {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_PRODUCTS_QUANTITY_KEY]});
      }
      toastr.success(message);
      form.reset();
      setIsEditing(false);
      setIsModalOpen(null);
    },
    onError: (message) => {
      toastr.error(message || "Failed to update products.");
      console.error("Error updating products:", message);
    },
  });


  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    mode: "onChange",
    defaultValues: {
      name: editedProduct.name,
      description: editedProduct.description,
      price: editedProduct.price,
      quantity: editedProduct.quantity,
      image: undefined,
      category_id: editedProduct.categoryId,
      created_by: user?.username || "unknown",
    }
  });

  const onSubmit = async (data: CreateProductSchemaType) => {
    console.log(data, "DATA");
    updateProducts({ id: product.id, products: data });
  }

  useEffect(() => {
    console.log("Current form errors:", form.formState.errors);
  }, [form.formState.errors]);

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
        quantity: editedProduct.quantity,
        image: undefined,
        category_id: editedProduct.categoryId,
        created_by: user?.username || "unknown",
      });
      setImagePreview(product.image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } , [isEditing]);
  
  return (
    <Dialog open={isModalOpen != null} onOpenChange={(open) => {
      setIsModalOpen(open ? isModalOpen : null);
      if (!open) {
        setIsEditing(false);
        setEditedProduct(product);
      }
    }}>
      <DialogContent className="max-w-2xl bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className='space-y-1'>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Make changes to {product.name}
                    </DialogDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    type='button'
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
                  <>
                  <img
                    src={imagePreview}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={() => setImageError(true)}
                  />
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              key={"fileInputKey"}
                              className="cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                field.onChange(file); 

                                const previewUrl = URL.createObjectURL(file);

                                setImagePreview(previewUrl);
                                setImageError(false);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                  </>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-muted rounded-lg">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Product Name</p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{editedProduct.name}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter product description"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-sm">{editedProduct.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="₱0.00"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange(e.target.valueAsNumber)
                                    console.log("Price changed to:", e.target.valueAsNumber);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="text-lg font-bold text-price-primary">{editedProduct.price}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Quantity</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={field.value || ""}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="text-lg font-semibold">{editedProduct.quantity}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value !== undefined ? field.value.toString() : "-1"}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full cursor-pointer">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="-1" disabled>Select a category</SelectItem>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()} className="cursor-pointer">
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <Badge variant="default">{editedProduct.category.name}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <Button 
                    className="w-full cursor-pointer" 
                    type="submit" 
                    // type='button'
                    // onClick={form.handleSubmit(onSubmit)}
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>
            <div className="hidden">
              <FormField
                control={form.control}
                name="created_by"
                render={() => (<></>)}
                />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteProductModal: React.FC<Props> = ({ product, setIsModalOpen }) => {
  
  const { mutate: deleteProduct, isPending } = useDeleteProduct({
    onSuccess: (message) => {
      toastr.success(message);
      setIsModalOpen(null);
    },
    onError: (message) => {
      toastr.error(message || "Failed to delete product.");
      console.error("Error deleting product:", message);
    },
  });
  
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete {product.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => setIsModalOpen(null)} 
            className='cursor-pointer'
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className='cursor-pointer'
            onClick={() => deleteProduct(product.id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}