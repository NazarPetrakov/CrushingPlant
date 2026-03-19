using CrushingPlantApi.Infrastructure.Commands;
using CrushingPlantApi.Models;
using Npgsql;

namespace CrushingPlantApi.Infrastructure.Repositories
{
    public class MetricsRepository
    {
        private readonly NpgsqlDataSource _dataSource;

        public MetricsRepository(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        public async Task UpdateConveyersMetricsRandomlyAsync()
        {
            await using var command = _dataSource.CreateCommand(MetricsSqlCommands.UpdateConveyorsRandomly);

            await command.ExecuteNonQueryAsync();
        }

        public async Task<CrusherMetrics?> GetCrusherMetricsAsync(string equipmentId)
        {
            return await GetSingleMetricsAsync(MetricsSqlCommands.SelectCrusherMetricsById, equipmentId,
                reader => new CrusherMetrics()
                {
                    EquipmentId = reader.GetString(0),
                    Temperature = reader.IsDBNull(1) ? null : reader.GetInt16(1),
                    Load = reader.IsDBNull(2) ? null : reader.GetInt16(2),
                    Power = reader.IsDBNull(3) ? null : reader.GetInt16(3),
                    FeedingSize = reader.IsDBNull(4) ? null : reader.GetInt16(4),
                    DischargeSize = reader.IsDBNull(5) ? null : reader.GetInt16(5),
                    MetricsUpdatedAt = reader.GetDateTime(6),
                });
        }
        public async Task<ConveyorMetrics?> GetConveyorMetricsAsync(string equipmentId)
        {
            return await GetSingleMetricsAsync(MetricsSqlCommands.SelectConveyorMetricsById, equipmentId,
                reader => new ConveyorMetrics()
                {
                    EquipmentId = reader.GetString(0),
                    Speed = reader.IsDBNull(1) ? null : reader.GetFloat(1),
                    MetricsUpdatedAt = reader.GetDateTime(2),
                }
            );
        }
        public async Task<BunkerMetrics?> GetBunkerMetricsAsync(string equipmentId)
        {
            return await GetSingleMetricsAsync(MetricsSqlCommands.SelectBunkerMetricsById, equipmentId,
                reader => new BunkerMetrics()
                {
                    EquipmentId = reader.GetString(0),
                    Level = reader.IsDBNull(1) ? null : reader.GetInt16(1),
                    Capacity = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                    MetricsUpdatedAt = reader.GetDateTime(3),
                }
            );
        }

        private async Task<T?> GetSingleMetricsAsync<T>(string sql, string equipmentId, Func<NpgsqlDataReader, T> map)
        {
            await using var command = _dataSource.CreateCommand(sql);
            command.Parameters.Add(new NpgsqlParameter { Value = equipmentId });

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                return map(reader);
            }

            return default;
        }
    }
}
