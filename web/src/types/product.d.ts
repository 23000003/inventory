

export type ProductType = {
  productId: number;
}

export type ProductFilter = {
  category?: string[];
  priceRange?: string[];
  searchTerm?: string;
  sortBy?: string;
}