using api.Infrastructure;
using api.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace api
{
    internal partial class StartupConfigurer
    {
        private void SeedApplication(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ClarenceDbContext>();

            // Apply migrations (if any)
            db.Database.Migrate();

            if (!db.Category.Any() && !db.Products.Any())
            {

                Log.Information("No migrations found in the database. Applying migrations...");

                var categories = new List<Category>
                    {
                        new Category { Name = "Electronics", Description = "Electronic gadgets and devices", CreatedBy = "Seeder", NumberOfProducts = 8 },
                        new Category { Name = "Books", Description = "Various kinds of books and literature", CreatedBy = "Seeder", NumberOfProducts = 8 },
                        new Category { Name = "Clothing", Description = "Men's and women's clothing", CreatedBy = "Seeder", NumberOfProducts = 8 },
                        new Category { Name = "Home & Kitchen", Description = "Home appliances and kitchen items", CreatedBy = "Seeder", NumberOfProducts = 8 }
                    };

                // Add categories to DB
                db.Category.AddRange(categories);
                db.SaveChanges();

                // Seed products for each category
                var products = new List<Product>();

                // Electronics
                var electronicsId = categories.First(c => c.Name == "Electronics").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "Smartphone", Description = "Latest model smartphone", Price = 699.99f, Quantity = 50, Image = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Laptop", Description = "Powerful laptop for work", Price = 999.99f, Quantity = 30, Image = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Wireless Earbuds", Description = "Noise-cancelling earbuds", Price = 129.99f, Quantity = 100, Image = "https://images.unsplash.com/photo-1585386959984-a41552262c27", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Smartwatch", Description = "Fitness tracking smartwatch", Price = 199.99f, Quantity = 75, Image = "https://images.unsplash.com/photo-1516579486066-4bbf64a00d66", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Tablet", Description = "High-res screen tablet", Price = 399.99f, Quantity = 40, Image = "https://images.unsplash.com/photo-1587829741301-dc798b83add3", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Gaming Console", Description = "Latest-gen gaming console", Price = 499.99f, Quantity = 25, Image = "https://images.unsplash.com/photo-1606813904789-925b1810a4f9", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Bluetooth Speaker", Description = "Portable bluetooth speaker", Price = 89.99f, Quantity = 80, Image = "https://images.unsplash.com/photo-1598550487035-57c1e3860d2f", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Digital Camera", Description = "High quality digital camera", Price = 549.99f, Quantity = 15, Image = "https://images.unsplash.com/photo-1519183071298-a2962beadeec", CreatedBy = "Seeder", CategoryId = electronicsId }
                });

                // Books
                var booksId = categories.First(c => c.Name == "Books").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "The Great Gatsby", Description = "Classic novel by F. Scott Fitzgerald", Price = 14.99f, Quantity = 100, Image = "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "1984", Description = "Dystopian novel by George Orwell", Price = 12.99f, Quantity = 90, Image = "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "To Kill a Mockingbird", Description = "Classic novel by Harper Lee", Price = 11.99f, Quantity = 110, Image = "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Clean Code", Description = "Programming book by Robert C. Martin", Price = 39.99f, Quantity = 40, Image = "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Atomic Habits", Description = "Self-help by James Clear", Price = 16.99f, Quantity = 70, Image = "https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Harry Potter Box Set", Description = "All 7 books", Price = 79.99f, Quantity = 20, Image = "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "The Hobbit", Description = "Fantasy novel by Tolkien", Price = 13.99f, Quantity = 60, Image = "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Sapiens", Description = "A brief history of humankind", Price = 18.99f, Quantity = 50, Image = "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg", CreatedBy = "Seeder", CategoryId = booksId }
                });

                // Clothing
                var clothingId = categories.First(c => c.Name == "Clothing").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "Men's T-Shirt", Description = "Cotton casual T-shirt", Price = 19.99f, Quantity = 120, Image = "https://images.pexels.com/photos/1002640/pexels-photo-1002640.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Women's Jeans", Description = "Stylish denim jeans", Price = 49.99f, Quantity = 80, Image = "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Hoodie", Description = "Warm hoodie for winter", Price = 39.99f, Quantity = 60, Image = "https://images.pexels.com/photos/5704841/pexels-photo-5704841.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Jacket", Description = "Waterproof outdoor jacket", Price = 89.99f, Quantity = 30, Image = "https://images.pexels.com/photos/769106/pexels-photo-769106.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Sneakers", Description = "Comfortable running shoes", Price = 59.99f, Quantity = 100, Image = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Cap", Description = "Adjustable baseball cap", Price = 14.99f, Quantity = 150, Image = "https://images.pexels.com/photos/5658872/pexels-photo-5658872.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Dress", Description = "Elegant evening dress", Price = 69.99f, Quantity = 40, Image = "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Socks (5-pack)", Description = "Cotton socks pack", Price = 9.99f, Quantity = 200, Image = "https://images.pexels.com/photos/19090/pexels-photo.jpg", CreatedBy = "Seeder", CategoryId = clothingId }
                });

                // Home & Kitchen
                var homeId = categories.First(c => c.Name == "Home & Kitchen").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "Blender", Description = "Electric smoothie blender", Price = 49.99f, Quantity = 30, Image = "https://images.unsplash.com/photo-1608198093002-ad4e005484ce", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Microwave Oven", Description = "Compact microwave oven", Price = 89.99f, Quantity = 25, Image = "https://images.unsplash.com/photo-1616628182502-8ecbdf75ef1a", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Air Fryer", Description = "Healthy cooking air fryer", Price = 99.99f, Quantity = 40, Image = "https://images.unsplash.com/photo-1643731385510-3ba2dd131e51", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Cookware Set", Description = "Non-stick pots and pans", Price = 129.99f, Quantity = 15, Image = "https://images.unsplash.com/photo-1607083206173-67f6b58c4a7b", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Vacuum Cleaner", Description = "Cordless vacuum cleaner", Price = 149.99f, Quantity = 20, Image = "https://images.unsplash.com/photo-1581579185169-7f7e57f1b975", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Toaster", Description = "2-slice bread toaster", Price = 29.99f, Quantity = 60, Image = "https://images.unsplash.com/photo-1620309243916-bf11e0f9d564", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Cutlery Set", Description = "Stainless steel cutlery", Price = 24.99f, Quantity = 70, Image = "https://images.unsplash.com/photo-1610041440307-b979fa3b1810", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Electric Kettle", Description = "Fast boiling kettle", Price = 34.99f, Quantity = 50, Image = "https://images.unsplash.com/photo-1590080875831-03c4b95ba7b0", CreatedBy = "Seeder", CategoryId = homeId }
                });


                // Add all products to DB
                db.Products.AddRange(products);

                // Save everything
                db.SaveChanges();
            }
            else
            {
                Log.Information("Migrations already applied. Skipping database migration.");
            }
        }
    }
}
