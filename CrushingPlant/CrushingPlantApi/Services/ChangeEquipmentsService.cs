using CrushingPlantApi.Infrastructure.Repositories;

namespace CrushingPlantApi.Services
{
    public class ChangeEquipmentsService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ChangeEquipmentsService> _logger;
        private int _counter = 0;

        public ChangeEquipmentsService(IServiceScopeFactory scopeFactory, ILogger<ChangeEquipmentsService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await TryUpdateAsync(UpdateEquipmentsStatus, nameof(UpdateEquipmentsStatus));
                await TryUpdateAsync(UpdateConveyorsMetrics, nameof(UpdateConveyorsMetrics));

                _counter++;

                _logger.LogInformation("Update #{Count}", _counter);

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
        private async Task UpdateConveyorsMetrics()
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<MetricsRepository>();

            await repository.UpdateConveyersMetricsRandomlyAsync();
        }
        private async Task UpdateEquipmentsStatus()
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<EquipmentRepository>();

            await repository.UpdateEquipmentsStatusRandomlyAsync();
        }
        private async Task TryUpdateAsync(Func<Task> action, string operationName)
        {
            try
            {
                await action();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to execute {Operation}", operationName);
            }
        }
    }
}
