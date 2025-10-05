import CategoryService from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";

export const GET_ALL_CATEGORIES_KEY = "categories";

const useGetCategories = () => {
  return useQuery({
    queryKey: [GET_ALL_CATEGORIES_KEY],
    queryFn: () => CategoryService.getAll(""),
    select: (data) => data.data.data,
  });
};

export default useGetCategories;