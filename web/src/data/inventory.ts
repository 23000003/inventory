import type { CategorySchemaType } from "@/schemas/category.schema";
import type { ProductSchemaType } from "@/schemas/product.schema";

// Mock data for demonstration
export const mockCategories: CategorySchemaType[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    price: "₱500.00 - ₱50000.00",
    number_of_products: "145",
    created_by: "admin",
    created_date: new Date().toISOString(),
    Products: []
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion and apparel",
    price: "₱200.00 - ₱5000.00",
    number_of_products: "89",
    created_by: "admin",
    created_date: new Date().toISOString(),
    Products: []
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    price: "₱100.00 - ₱15000.00",
    number_of_products: "267",
    created_by: "admin",
    created_date: new Date().toISOString(),
    Products: []
  },
  {
    id: 4,
    name: "Books",
    description: "Educational and entertainment books",
    price: "₱150.00 - ₱2000.00",
    number_of_products: "423",
    created_by: "admin",
    created_date: new Date().toISOString(),
    Products: []
  },
  {
    id: 5,
    name: "Sports & Fitness",
    description: "Sports equipment and fitness gear",
    price: "₱300.00 - ₱8000.00",
    number_of_products: "156",
    created_by: "admin",
    created_date: new Date().toISOString(),
    Products: []
  }
];

export const mockProducts: ProductSchemaType[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation",
    price: "₱3,499.00",
    quantity: "25",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 1,
    category: {
      id: 1,
      name: "Electronics",
      description: "Electronic devices",
      price: "₱500.00 - ₱50000.00",
      number_of_products: "145",
      created_by: "admin",
      created_date: new Date()
    }
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors",
    price: "₱899.00",
    quantity: "150",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 2,
    category: {
      id: 2,
      name: "Clothing",
      description: "Fashion and apparel",
      price: "₱200.00 - ₱5000.00",
      number_of_products: "89",
      created_by: "admin",
      created_date: new Date()
    }
  },
  {
    id: 3,
    name: "Smartphone Case",
    description: "Durable protective case for smartphones",
    price: "₱599.00",
    quantity: "75",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 1,
    category: {
      id: 1,
      name: "Electronics",
      description: "Electronic devices",
      price: "₱500.00 - ₱50000.00",
      number_of_products: "145",
      created_by: "admin",
      created_date: new Date()
    }
  },
  {
    id: 4,
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with programmable timer",
    price: "₱4,299.00",
    quantity: "18",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 3,
    category: {
      id: 3,
      name: "Home & Garden",
      description: "Home improvement and garden supplies",
      price: "₱100.00 - ₱15000.00",
      number_of_products: "267",
      created_by: "admin",
      created_date: new Date()
    }
  },
  {
    id: 5,
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole",
    price: "₱2,799.00",
    quantity: "42",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 5,
    category: {
      id: 5,
      name: "Sports & Fitness",
      description: "Sports equipment and fitness gear",
      price: "₱300.00 - ₱8000.00",
      number_of_products: "156",
      created_by: "admin",
      created_date: new Date()
    }
  },
  {
    id: 6,
    name: "Programming Book",
    description: "Complete guide to modern web development",
    price: "₱1,299.00",
    quantity: "63",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    created_by: "admin",
    created_date: new Date().toISOString(),
    category_id: 4,
    category: {
      id: 4,
      name: "Books",
      description: "Educational and entertainment books",
      price: "₱150.00 - ₱2000.00",
      number_of_products: "423",
      created_by: "admin",
      created_date: new Date()
    }
  }
];