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

            if (!db.Category.Any() && !db.Products.Any() && !db.ChatRooms.Any() && !db.ChatMessages.Any() && !db.Users.Any())
            {

                Log.Information("No data found in the database. Applying mock data...");

                var _users = new List<User>()
                {
                    new User { Username = "Kenny123", Password = "password123", Role = Roles.Inventory },
                    new User { Username = "Yosep", Password = "password123", Role = Roles.Sales },
                    new User { Username = "Clarence", Password = "password123", Role = Roles.Sales },

                    new User { Username = "TestUser", Password = "password123", Role = Roles.Sales }, // has messages

                    new User { Username = "TestUser1", Password = "password123", Role = Roles.Sales },
                    new User { Username = "TestUser2", Password = "password123", Role = Roles.Sales },
                    new User { Username = "TestUser3", Password = "password123", Role = Roles.Sales },
                    new User { Username = "TestUser4", Password = "password123", Role = Roles.Sales },
                    new User { Username = "TestUser5", Password = "password123", Role = Roles.Sales }

                };

                db.Users.AddRange(_users);
                db.SaveChanges();

                var chatRooms = new List<ChatRoom>();

                foreach (var user in _users.Where(u => u.Username.StartsWith("TestUser")))
                {
                    var chatRoom = new ChatRoom
                    {
                        InitiatorId = user.Id, 
                        RoomId = Guid.NewGuid().ToString(),
                        CreatedBy = "Seeder",
                        CreatedDate = DateTime.UtcNow,
                        Messages = new List<ChatMessages>()
                    };

                    chatRooms.Add(chatRoom);
                }

                db.ChatRooms.AddRange(chatRooms);
                db.SaveChanges();

                var tstMsgs = new List<ChatMessages>();

                foreach (var room in chatRooms)
                {
                    if(room.Id == chatRooms[0].Id)
                        continue;
                    
                    tstMsgs.Add(new ChatMessages { RoomId = room.Id, IsInventorySender = false, Message = "Hello, is anyone there?", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow });
                }

                db.ChatMessages.AddRange(tstMsgs);
                db.SaveChanges();

                var chatMessages = new List<ChatMessages>
                {
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false, Message = "Hey, do you have Lebron James jersey in stock?", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false,  Message = "And do u have medium and large sizes.", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false, Message = "And How much is it?", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = true,  Message = "It’s $150 for the standard jersey.", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false, Message = "Can you reserve one for me?", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = true,  Message = "Sure, which size do you want?", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false, Message = "Medium, please.", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = true,  Message = "Medium is reserved for you now.", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = false, Message = "Thank you!", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow },
                    new() { RoomId = chatRooms[0].Id, IsInventorySender = true,  Message = "You’re welcome! Come pick it up anytime today.", CreatedBy = "Seeder", CreatedDate = DateTime.UtcNow }
                };

                db.ChatMessages.AddRange(chatMessages);
                db.SaveChanges();

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
                    new Product { Name = "Smartphone", Description = "Latest model smartphone", Price = 699.99f, Quantity = 50, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909678/4171_g41zum.webp", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Laptop", Description = "Powerful laptop for work", Price = 999.99f, Quantity = 30, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909782/m4-macbook-air-15-11_pumivo.webp", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Wireless Earbuds", Description = "Noise-cancelling earbuds", Price = 129.99f, Quantity = 100, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909817/2tb2KWDC5dLHBVm7Tuy8Do_c1bdq1.png", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Smartwatch", Description = "Fitness tracking smartwatch", Price = 199.99f, Quantity = 75, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909853/BEST-SMARTWATCH-ANDROID-PHONES-04013_oortep.webp", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Tablet", Description = "High-res screen tablet", Price = 399.99f, Quantity = 40, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909866/BEST-IPAD-2048px-11thgen-pencil_hokzxg.jpg", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Gaming Console", Description = "Latest-gen gaming console", Price = 499.99f, Quantity = 25, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909881/gamingconsoles-2048px-00730-3x2-1_opfsny.webp", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Bluetooth Speaker", Description = "Portable bluetooth speaker", Price = 89.99f, Quantity = 80, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909896/1cd68e4768e3c98203c441010c0b6cf4_qnup8q.avif", CreatedBy = "Seeder", CategoryId = electronicsId },
                    new Product { Name = "Digital Camera", Description = "High quality digital camera", Price = 549.99f, Quantity = 15, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766909922/nBZ6jqFcmxwxzhZ8P2NCsT-1920-80_pzt3s4.jpg", CreatedBy = "Seeder", CategoryId = electronicsId }
                });

                // Books
                var booksId = categories.First(c => c.Name == "Books").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "The Great Gatsby", Description = "Classic novel by F. Scott Fitzgerald", Price = 14.99f, Quantity = 100, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910029/The_Great_Gatsby_Cover_1925_Retouched_dj1ax6.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "1984", Description = "Dystopian novel by George Orwell", Price = 12.99f, Quantity = 90, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910041/13xLRb-vHz2DfdgvhkjkHg_cvq9fm.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "To Kill a Mockingbird", Description = "Classic novel by Harper Lee", Price = 11.99f, Quantity = 110, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910063/2657_uuqky1.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Clean Code", Description = "Programming book by Robert C. Martin", Price = 39.99f, Quantity = 40, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910074/81Rnac2Fq_L._AC_UF1000_1000_QL80__dke5ll.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Atomic Habits", Description = "Self-help by James Clear", Price = 16.99f, Quantity = 70, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910089/atomic-habits_cil25l.webp", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Harry Potter Box Set", Description = "All 7 books", Price = 79.99f, Quantity = 20, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910110/81RYnJlimmL._AC_SL1500_n41awv.webp", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "The Hobbit", Description = "Fantasy novel by Tolkien", Price = 13.99f, Quantity = 60, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910123/MV5BMzU0NDY0NDEzNV5BMl5BanBnXkFtZTgwOTIxNDU1MDE._V1__p5y9xz.jpg", CreatedBy = "Seeder", CategoryId = booksId },
                    new Product { Name = "Sapiens", Description = "A brief history of humankind", Price = 18.99f, Quantity = 50, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910131/23692271_qr1m4d.jpg", CreatedBy = "Seeder", CategoryId = booksId }
                });

                // Clothing
                var clothingId = categories.First(c => c.Name == "Clothing").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "Men's T-Shirt", Description = "Cotton casual T-shirt", Price = 19.99f, Quantity = 120, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910239/Untitleddesign_24_1024x1024_chwqpi.webp", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Women's Jeans", Description = "Stylish denim jeans", Price = 49.99f, Quantity = 80, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910251/Women-s-High-Waisted-Ripped-Jeans-For-Women-Lift-Distressed-Stretch-Juniors-Skinny-Jeanswomen-s-slim-bootcut-jeans-women-s-low-size-12_ac4b0421-2c10-4340-808d-48d02781b23a.29499dd06856e79382e91db9ace8eb77_tn6jbv.avif", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Hoodie", Description = "Warm hoodie for winter", Price = 39.99f, Quantity = 60, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910260/DropShoulderHoodie-Grey-productphoto_1_grande_zgc4af.webp", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Jacket", Description = "Waterproof outdoor jacket", Price = 89.99f, Quantity = 30, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910271/Summer_Puffer_Jacket_Malo-Jackets-7292h-914R-4210_golden_brown_329e1ce6-23c1-43a8-b763-de1a3c8c52d2_800x_k6mlln.webp", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Sneakers", Description = "Comfortable running shoes", Price = 59.99f, Quantity = 100, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910281/Easy-Rider-Mix-Sneakers-Unisex_qicluz.avif", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Cap", Description = "Adjustable baseball cap", Price = 14.99f, Quantity = 150, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910293/SD_03_T09_2330_Y0_X_EC_94_hdd6f4.webp", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Dress", Description = "Elegant evening dress", Price = 69.99f, Quantity = 40, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910303/Tie_Shoulder_Layered_Ruched_Cami_Dress_In_Pink_citgxm.webp", CreatedBy = "Seeder", CategoryId = clothingId },
                    new Product { Name = "Socks (5-pack)", Description = "Cotton socks pack", Price = 9.99f, Quantity = 200, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910319/Cotton-Crew-Socks-for-Women-White-6-Pairs-Size-9-11_679f97bc-0706-4aef-9b35-ef8e729684e0.1f9ee4259e4ac5ce324bd660714284f8_w5hfeh.avif", CreatedBy = "Seeder", CategoryId = clothingId }
                });

                // Home & Kitchen
                var homeId = categories.First(c => c.Name == "Home & Kitchen").Id;
                products.AddRange(new[]
                {
                    new Product { Name = "Blender", Description = "Electric smoothie blender", Price = 49.99f, Quantity = 30, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910460/eeb-1.5l-black-1_sljrq2.webp", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Microwave Oven", Description = "Compact microwave oven", Price = 89.99f, Quantity = 25, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910472/FMEG23GBL_800x_ibgdpt.webp", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Air Fryer", Description = "Healthy cooking air fryer", Price = 99.99f, Quantity = 40, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910484/bhg-ninja-crispi-4-in-1-portable-glass-air-fryer-cooking-system-jamie-weissman-05-dbc470ab815840b9809d7e0540f3e3e2_puqlu1.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Cookware Set", Description = "Non-stick pots and pans", Price = 129.99f, Quantity = 15, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910496/ikea-365-cookware-set-of-6-stainless-steel__1006151_pe825738_s5_jswpyi.avif", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Vacuum Cleaner", Description = "Cordless vacuum cleaner", Price = 149.99f, Quantity = 20, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910513/Numatic_Henry_vacuum_cleaner__3308986870___cropped_pfj23p.jpg", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Toaster", Description = "2-slice bread toaster", Price = 29.99f, Quantity = 60, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910524/Website-Photo-Standard_swc7bo.png", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Cutlery Set", Description = "Stainless steel cutlery", Price = 24.99f, Quantity = 70, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910537/EllaPGold_oszin4.webp", CreatedBy = "Seeder", CategoryId = homeId },
                    new Product { Name = "Electric Kettle", Description = "Fast boiling kettle", Price = 34.99f, Quantity = 50, Image = "https://res.cloudinary.com/domvrvasq/image/upload/v1766910550/ekr-1.7l-3_y5qaay.webp", CreatedBy = "Seeder", CategoryId = homeId }
                });


                // Add all products to DB
                db.Products.AddRange(products);

                // Save everything
                db.SaveChanges();
            }
            else
            {
                Log.Information("Mock data already applied. Skipping data seeding.");
            }
        }
    }
}
