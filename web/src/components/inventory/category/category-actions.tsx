import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../../ui/alert-dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "../../ui/form";
import { Input } from "../../ui/input";
import { toastr } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategorySchema, type CategorySchemaType, type CreateCategorySchemaType } from "@/schemas/category.schema";
import type { UserInfoType } from "@/types/user-info";
import useCreateCategory from "@/hooks/categories/useCreateCategory";
import useDeleteCategory from "@/hooks/categories/useDeleteCategory";
import useUpdateCategory from "@/hooks/categories/useUpdateCategory";
import { Button } from "../../ui/button";


export const CreateCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserInfoType;
}> = ({ isOpen, onClose, user }) => {

  const { mutate: createCategory, isPending } = useCreateCategory({
    onSuccess: (message) => {
      toastr.success(message);
      onClose();
    },
    onError: (message) => {
      toastr.error(message || "Failed to create product.");
      console.error("Error create product:", message);
    },
  })

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      created_by: user?.username || "unknown",
    }
  });

  const onSubmit = async (data: CreateCategorySchemaType) => {
    console.log(data);
    createCategory(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="created_by"
              render={() => <></>}
            />
            <Button
              className="w-full cursor-pointer" 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const EditCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  category: CategorySchemaType;
  user: UserInfoType;
}> = ({ isOpen, onClose, category, user }) => {

  const { mutate: updateCategory, isPending } = useUpdateCategory({
    onSuccess: (message) => {
      toastr.success(message);
      onClose();
    },
    onError: (message) => {
      toastr.error(message || "Failed to update product.");
      console.error("Error update product:", message);
    },
  })


  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category.name,
      created_by: user?.username || "unknown",
    }
  });

  const onSubmit = async (data: CreateCategorySchemaType) => {
    updateCategory({ id: category.id, category: data });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="created_by"
              render={() => <></>}
            />
            <Button 
              className="w-full cursor-pointer" 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  categories: CategorySchemaType;
}> = ({ isOpen, onClose, categories }) => {

  const { mutate: deleteCategory, isPending } = useDeleteCategory({
    onSuccess: (message) => {
      toastr.success(message);
      onClose();
    },
    onError: (message) => {
      toastr.error(message || "Failed to delete product.");
      console.error("Error deleting product:", message);
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            You have <b>{categories.numberOfProducts}</b> products left. This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className='cursor-pointer'
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className='cursor-pointer'
            onClick={() => deleteCategory(categories.id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};