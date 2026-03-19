using CrushingPlantApi.Endpoints;
using CrushingPlantApi.Infrastructure.Repositories;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var configuration = builder.Configuration;

builder.Services.AddNpgsqlDataSource(configuration.GetConnectionString("PostgresConnection") ?? "");
builder.Services.AddScoped<EquipmentRepository>();
builder.Services.AddScoped<MetricsRepository>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapEquipmentEndpoints();

app.Run();
