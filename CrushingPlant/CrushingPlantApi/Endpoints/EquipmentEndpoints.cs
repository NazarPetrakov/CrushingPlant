using CrushingPlantApi.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CrushingPlantApi.Endpoints
{
    public static class EquipmentEndpoints
    {
        public static void MapEquipmentEndpoints(this WebApplication app)
        {
            app.MapGet("/equipment", async ([FromServices] EquipmentRepository repository) =>
            {
                return Results.Ok(await repository.GetEquipmentsAsync());
            });


        }
    }
}
