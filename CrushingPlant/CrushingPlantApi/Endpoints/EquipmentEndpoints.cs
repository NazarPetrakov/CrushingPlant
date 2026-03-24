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

            app.MapGet("/equipments/{id}/crusher-metrics", async (
                [FromServices] MetricsRepository repository, string id) =>
            {
                var crusher = await repository.GetCrusherMetricsAsync(id);

                if (crusher == null)
                    return Results.NotFound($"Crusher metrics with equipment id '{id}' not found.");

                return Results.Ok(crusher);
            });
            app.MapGet("/equipments/{id}/conveyor-metrics", async (
                [FromServices] MetricsRepository repository, string id) =>
            {
                var conveyor = await repository.GetConveyorMetricsAsync(id);

                if (conveyor == null)
                    return Results.NotFound($"Conveyor metrics with equipment id '{id}' not found.");

                return Results.Ok(conveyor);
            });
            app.MapGet("/equipments/{id}/bunker-metrics", async (
                [FromServices] MetricsRepository repository, string id) =>
            {
                var bunker = await repository.GetBunkerMetricsAsync(id);

                if (bunker == null)
                    return Results.NotFound($"Bunker metrics with equipment id '{id}' not found.");

                return Results.Ok(bunker);
            });
        }
    }
}
