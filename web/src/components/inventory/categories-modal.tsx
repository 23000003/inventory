import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCategorySchema, type CategorySchemaType, type CreateCategorySchemaType } from "@/schemas/category.schema";
import { Button } from "@/components/ui/button"; // assuming you have a Button component
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { InventoryProductActions } from "@/types/inventory.d";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import useDeleteCategory from "@/hooks/categories/useDeleteCategory";
import { toastr } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";
import type { UserInfoType } from "@/types/user-info";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import useUpdateCategory from "@/hooks/categories/useUpdateCategory";
import useCreateCategory from "@/hooks/categories/useCreateCategory";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  categories: CategorySchemaType[];
};

const ViewCategories: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  categories,
}) => {

  const { user } = useUserStore();

  const [selectedCategory, setSelectedCategory] = useState<CategorySchemaType | null>(null);
  const [openAnotherModal, setOpenAnotherModal] = useState<InventoryProductActions | null>(null);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-[1000px] bg-white">
        <DialogHeader>
          <DialogTitle>All Categories</DialogTitle>
          <DialogDescription>
            Complete information about all categories in the inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-md">
            <thead className="text-white bg-[#7C3BED] font-light">
              <tr>
                <th className="text-left py-2 px-4 border-b font-semibold">Category Name</th>
                <th className="text-left py-2 px-4 border-b font-semibold ">Num of Products</th>
                <th className="text-left py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.name} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium text-center">{category.name}</td>
                  <td className="py-2 px-4 border-b text-center">{category.numberOfProducts}</td>
                  <td className="py-2 px-4 border-b space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenAnotherModal(InventoryProductActions.EDIT);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenAnotherModal(InventoryProductActions.DELETE)
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-4">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setOpenAnotherModal(InventoryProductActions.CREATE)}
            >
              <Plus className="mr-2" /> Add New Category
            </Button>
          </div>
        </div>
        {openAnotherModal === InventoryProductActions.CREATE ? (
          <CreateCategoryModal
            isOpen={true}
            user={user!}
            onClose={() => setOpenAnotherModal(null)}
          />
        ) : openAnotherModal === InventoryProductActions.EDIT ? (
          <EditCategoryModal
            isOpen={true}
            category={selectedCategory!}
            user={user!}
            onClose={() => setOpenAnotherModal(null)}
          />
        ) : openAnotherModal === InventoryProductActions.DELETE ? (
          <DeleteCategoryModal
            isOpen={true}
            categories={selectedCategory!}
            onClose={() => setOpenAnotherModal(null)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const CreateCategoryModal: React.FC<{
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

const EditCategoryModal: React.FC<{
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

const DeleteCategoryModal: React.FC<{
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

export default ViewCategories;
