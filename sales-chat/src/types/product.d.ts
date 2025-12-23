

export type ProductType = {
  productId: number;
}

export type ProductFilter = {
  category?: string[];
  priceRange?: string[];
  search?: string;
  sortBy?: string;
}