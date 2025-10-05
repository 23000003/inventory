import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { CreateProductSchema, type CreateProductSchemaType } from "@/schemas/product.schema";
import { toastr } from "@/utils/toast";
import { useUserStore } from "@/stores/useUserStore";
import type { CategorySchemaType } from "@/schemas/category.schema";

interface Props {
  onAddProduct: (product: CreateProductSchemaType) => void;
  categories: CategorySchemaType[];
}

export const ProductForm: React.FC<Props> = ({ 
  onAddProduct, 
  categories 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const { user } = useUserStore();

  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 1,
      image: undefined,
      category_id: -1,
      created_by: user?.username || "unknown",
    }
  });

  useEffect(() => {
    form.setValue("created_by", user?.username || "unknown");
  }, [user, form]); 

  const onSubmit = async (data: CreateProductSchemaType) => {
    setIsSubmitting(true);

    const selectedCategory = categories.find(cat => cat.id === data.category_id);

    if (!selectedCategory) {
      toastr.error("Error", "Selected category not found");
      setIsSubmitting(false);
      return;
    }

    const newProduct: CreateProductSchemaType = {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      image: data.image,
      category_id: data.category_id,
      created_by: data.created_by,
    };

    onAddProduct(newProduct);
    
    toastr.success("Success", "Product added to creation list");

    form.reset();
    setFileInputKey(Date.now());
    setIsSubmitting(false);
  };

  useEffect(() => {
    console.log("Current form errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[520px]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="₱0.00"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  key={fileInputKey}
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file); 
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="hidden">
          <FormField
            control={form.control}
            name="created_by"
            render={() => (<></>)}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isSubmitting ? "Adding Product..." : "Add to Creation List"}
        </Button>
      </form>
    </Form>
  );
};