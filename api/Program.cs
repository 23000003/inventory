global using Microsoft.EntityFrameworkCore;
using api;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Clarence Inventory API");

    #region DI Setup

    var builder = WebApplication.CreateBuilder(args);

    var configurer = new StartupConfigurer(builder.Configuration, builder.Services);

    configurer.ConfigureServices();

    #endregion


    #region Pipeline

    var app = builder.Build();

    configurer.ConfigureApplication(app, app.Environment);

    app.MapControllers();
    
    #endregion

    Log.Information("Application running successfully.");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
