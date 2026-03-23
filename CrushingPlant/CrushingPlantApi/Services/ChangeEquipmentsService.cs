using CrushingPlantApi.Infrastructure.Repositories;

namespace CrushingPlantApi.Services
{
    public class ChangeEquipmentsService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ChangeEquipmentsService> _logger;
        private readonly IConfiguration _configuration;
        private int _counter = 0;

        public ChangeEquipmentsService(
            IServiceScopeFactory scopeFactory,
            ILogger<ChangeEquipmentsService> logger,
            IConfiguration configuration)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _configuration = configuration;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await TryUpdateAsync(UpdateEquipmentsStatus, nameof(UpdateEquipmentsStatus));
                await TryUpdateAsync(UpdateAllMetrics, nameof(UpdateAllMetrics));

                _counter++;

                _logger.LogInformation("Update #{Count}", _counter);

                if (!Int32.TryParse(_configuration.GetSection("AppConfiguration:UpdateIntervalInSeconds").Value,
                    out int delay))
                {
                    _logger.LogError("Failed to get delay from configuration");
                }

                await Task.Delay(TimeSpan.FromSeconds(delay), stoppingToken);
            }
        }
        private async Task UpdateAllMetrics()
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<MetricsRepository>();

            await repository.UpdateAllMetricsRandomlyAsync();
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
