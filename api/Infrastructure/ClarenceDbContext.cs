using System;
using api.Infrastructure.Model;

namespace api.Infrastructure;

public class ClarenceDbContext : DbContext
{
  public ClarenceDbContext(DbContextOptions<ClarenceDbContext> options) : base(options) {}

  public DbSet<Category> Category { get; set; }
  public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(e => {
          e.HasKey(e => e.Id);

          e.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(50);

          e.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(100);

          e.Property(e => e.NumberOfProducts)
            .IsRequired();

          e.Property(e => e.CreatedBy)
            .IsRequired();

          e.Property(e => e.CreatedDate)
            .IsRequired(); 
        });

        modelBuilder.Entity<Product>(e => {
          e.HasKey(e => e.Id);

          e.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(50);

          e.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(100);

          e.Property(e => e.Price)
            .IsRequired()
            .HasPrecision(18, 2);;
          
          e.Property(e => e.Quantity)
            .IsRequired();
          
          e.Property(e => e.Image)
            .IsRequired();

          e.Property(e => e.CreatedBy)
            .IsRequired();
          
          e.Property(e => e.CreatedDate)
            .IsRequired(); 
          
          e.HasOne(e => e.Category)
            .WithMany(e => e.Products)
            .HasForeignKey(e => e.CategoryId);
        });
    }
}
