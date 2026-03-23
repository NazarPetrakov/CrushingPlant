using CrushingPlantApi.Endpoints;
using CrushingPlantApi.Infrastructure.Repositories;
using CrushingPlantApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var configuration = builder.Configuration;

builder.Services.AddCors();

builder.Services.AddNpgsqlDataSource(configuration.GetConnectionString("PostgresConnection") ?? "");
builder.Services.AddScoped<EquipmentRepository>();
builder.Services.AddScoped<MetricsRepository>();
builder.Services.AddHostedService<ChangeEquipmentsService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(policy =>
{
    policy.WithOrigins("http://localhost:80", "http://localhost")
           .AllowAnyMethod()
           .AllowCredentials()
           .AllowAnyHeader();
});
//app.UseHttpsRedirection();

app.MapEquipmentEndpoints();

app.Run();
