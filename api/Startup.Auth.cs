using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Security.Claims;

namespace api
{
    internal partial class StartupConfigurer
    {
        private void ConfigureAuth()
        {
            this._services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                options.DefaultChallengeScheme =
                options.DefaultForbidScheme =
                options.DefaultScheme =
                options.DefaultSignInScheme =
                options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = this._configuration["JwtToken:Issuer"],
                    ValidAudience = this._configuration["JwtToken:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(this._configuration["JwtToken:Secret"])
                    ),
                    RoleClaimType = ClaimTypes.Role
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var path = context.HttpContext.Request.Path;

                        if (path.StartsWithSegments("/api/v1/products/listen-product-quantity"))
                        {
                            var accessToken = context.Request.Query["access_token"].FirstOrDefault();

                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                context.Token = accessToken;
                            }
                        }

                        return Task.CompletedTask;
                    },

                    OnChallenge = context =>
                    {
                        context.HandleResponse();

                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";

                        var response = new
                        {
                            message = "Unauthorized access.",
                            error = "You need a valid token to access this resource."
                        };

                        return context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
                    }
                };
            });

            this._services.AddAuthorization();
        }
    }
}
