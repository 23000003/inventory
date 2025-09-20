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
                        new Category { Name = "Electronics", Description = "Electronic gadgets and devices", CreatedBy = "Seeder" },
                        new Category { Name = "Books", Description = "Various kinds of books and literature", CreatedBy = "Seeder" },
                        new Category { Name = "Clothing", Description = "Men's and women's clothing", CreatedBy = "Seeder" },
                        new Category { Name = "Home & Kitchen", Description = "Home appliances and kitchen items", CreatedBy = "Seeder" }
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
                        new Product { Name = "Smartphone", Description = "Latest model smartphone", Price = 699.99f, Quantity = 50, Image = "smartphone.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Laptop", Description = "Powerful laptop for work", Price = 999.99f, Quantity = 30, Image = "laptop.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Wireless Earbuds", Description = "Noise-cancelling earbuds", Price = 129.99f, Quantity = 100, Image = "earbuds.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Smartwatch", Description = "Fitness tracking smartwatch", Price = 199.99f, Quantity = 75, Image = "smartwatch.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Tablet", Description = "High-res screen tablet", Price = 399.99f, Quantity = 40, Image = "tablet.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Gaming Console", Description = "Latest-gen gaming console", Price = 499.99f, Quantity = 25, Image = "console.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Bluetooth Speaker", Description = "Portable bluetooth speaker", Price = 89.99f, Quantity = 80, Image = "speaker.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                        new Product { Name = "Digital Camera", Description = "High quality digital camera", Price = 549.99f, Quantity = 15, Image = "camera.jpg", CreatedBy = "Seeder", CategoryId = electronicsId }
                    });

                // Books
                var booksId = categories.First(c => c.Name == "Books").Id;
                products.AddRange(new[]
                    {
                        new Product { Name = "The Great Gatsby", Description = "Classic novel by F. Scott Fitzgerald", Price = 14.99f, Quantity = 100, Image = "gatsby.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "1984", Description = "Dystopian novel by George Orwell", Price = 12.99f, Quantity = 90, Image = "1984.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "To Kill a Mockingbird", Description = "Classic novel by Harper Lee", Price = 11.99f, Quantity = 110, Image = "mockingbird.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "Clean Code", Description = "Programming book by Robert C. Martin", Price = 39.99f, Quantity = 40, Image = "cleancode.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "Atomic Habits", Description = "Self-help by James Clear", Price = 16.99f, Quantity = 70, Image = "atomic.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "Harry Potter Box Set", Description = "All 7 books", Price = 79.99f, Quantity = 20, Image = "hp.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "The Hobbit", Description = "Fantasy novel by Tolkien", Price = 13.99f, Quantity = 60, Image = "hobbit.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                        new Product { Name = "Sapiens", Description = "A brief history of humankind", Price = 18.99f, Quantity = 50, Image = "sapiens.jpg", CreatedBy = "Seeder", CategoryId = booksId }
                    });

                // Clothing
                var clothingId = categories.First(c => c.Name == "Clothing").Id;
                products.AddRange(new[]
                    {
                        new Product { Name = "Men's T-Shirt", Description = "Cotton casual T-shirt", Price = 19.99f, Quantity = 120, Image = "tshirt.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Women's Jeans", Description = "Stylish denim jeans", Price = 49.99f, Quantity = 80, Image = "jeans.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Hoodie", Description = "Warm hoodie for winter", Price = 39.99f, Quantity = 60, Image = "hoodie.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Jacket", Description = "Waterproof outdoor jacket", Price = 89.99f, Quantity = 30, Image = "jacket.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Sneakers", Description = "Comfortable running shoes", Price = 59.99f, Quantity = 100, Image = "sneakers.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Cap", Description = "Adjustable baseball cap", Price = 14.99f, Quantity = 150, Image = "cap.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Dress", Description = "Elegant evening dress", Price = 69.99f, Quantity = 40, Image = "dress.jpg", CreatedBy = "Seeder", CategoryId = clothingId },
                        new Product { Name = "Socks (5-pack)", Description = "Cotton socks pack", Price = 9.99f, Quantity = 200, Image = "socks.jpg", CreatedBy = "Seeder", CategoryId = clothingId }
                    });

                // Home & Kitchen
                var homeId = categories.First(c => c.Name == "Home & Kitchen").Id;
                products.AddRange(new[]
                    {
                        new Product { Name = "Blender", Description = "Electric smoothie blender", Price = 49.99f, Quantity = 30, Image = "blender.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Microwave Oven", Description = "Compact microwave oven", Price = 89.99f, Quantity = 25, Image = "microwave.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Air Fryer", Description = "Healthy cooking air fryer", Price = 99.99f, Quantity = 40, Image = "airfryer.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Cookware Set", Description = "Non-stick pots and pans", Price = 129.99f, Quantity = 15, Image = "cookware.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Vacuum Cleaner", Description = "Cordless vacuum cleaner", Price = 149.99f, Quantity = 20, Image = "vacuum.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Toaster", Description = "2-slice bread toaster", Price = 29.99f, Quantity = 60, Image = "toaster.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Cutlery Set", Description = "Stainless steel cutlery", Price = 24.99f, Quantity = 70, Image = "cutlery.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                        new Product { Name = "Electric Kettle", Description = "Fast boiling kettle", Price = 34.99f, Quantity = 50, Image = "kettle.jpg", CreatedBy = "Seeder", CategoryId = homeId }
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
