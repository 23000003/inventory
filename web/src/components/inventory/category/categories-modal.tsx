import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type CategorySchemaType } from "@/schemas/category.schema";
import { Button } from "@/components/ui/button"; // assuming you have a Button component
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { InventoryProductActions } from "@/types/inventory.d";
import { useUserStore } from "@/stores/useUserStore";
import { CreateCategoryModal, DeleteCategoryModal, EditCategoryModal } from "./category-actions";

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
      <DialogContent className="w-[1000px] bg-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>All Categories</DialogTitle>
          <DialogDescription>
            Complete information about all categories in the inventory.
          </DialogDescription>
        </DialogHeader>
{/* bg-[#7C3BED]  */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-gray-200 border">
            <thead className="text-white bg-[#7C3BED] font-light">
              <tr>
                <th className="text-left py-2 border-b font-semibold pl-4">Category Name</th>
                <th className="text-center py-2 border-b font-semibold">Num of Products</th>
                <th className="text-right py-2 border-b font-semibold pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.name} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium text-left">{category.name}</td>
                  <td className="py-2 px-4 border-b text-center">{category.numberOfProducts}</td>
                  <td className="py-2 px-4 border-b space-x-1 text-right">
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

export default ViewCategories;
