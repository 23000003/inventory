using api.Infrastructure;
using Asp.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Text.Json.Serialization;

namespace api                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
{
    internal partial class StartupConfigurer
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceCollection _services;

        public StartupConfigurer(IConfiguration configuration, IServiceCollection services)
        {
            this._configuration = configuration;
            this._services = services;
        }

        public void ConfigureServices()
        {
            Log.Information("Configure Services and DI");

            this._services.AddSerilog((services, lc) => lc
               .ReadFrom.Configuration(this._configuration)
               .ReadFrom.Services(services)
               .Enrich.FromLogContext());

            this._services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
            this._services.AddEndpointsApiExplorer();
            this._services.AddSwaggerGen();

            this._services.AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin",
                        builder =>
                        {
                            builder.WithOrigins(
                                "http://localhost:5173",
                                "http://localhost:5174"
                            )
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                        });
                });

            this._services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Clarence's Inventory API"});
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            this._services.AddDbContext<ClarenceDbContext>(options =>
                options.UseNpgsql(
                    this._configuration.GetConnectionString("ClarenceDatabase")
                )
            );

            this._services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
            });

            this.ConfigureOtherServices();
            this.ConfigureAuth();

            this._services.AddAuthorization();
        }

        public void ConfigureApplication(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Log.Information("Configure Application Pipeline");

            // seed db
            this.SeedApplication(app);

            // WebSocket middleware must come before Authentication/Authorization
            var webSocketOptions = new WebSocketOptions
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120)
            };
            app.UseWebSockets(webSocketOptions);

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowSpecificOrigin");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
        }
    }
}
