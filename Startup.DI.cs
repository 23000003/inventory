using api.Configurations;
using api.Infrastructure.Interfaces;
using api.Infrastructure.Repository;
using api.Interfaces;
using api.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace api
{
    internal partial class StartupConfigurer
    {
        private void ConfigureOtherServices()
        {
            // Binding configuration (Options pattern)
            this._services.Configure<CloudinaryConfig>(this._configuration.GetSection("CloudinaryConnection"));
            this._services.Configure<JwtConfig>(this._configuration.GetSection("JwtToken"));

            //services
            this._services.AddScoped<ITokenService, TokenService>();

            // repositories
            this._services.AddScoped<ICategoryRepository, CategoryRepository>();
            this._services.AddScoped<IProductRepository, ProductRepository>();
        }
    }
}
