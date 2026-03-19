using CrushingPlantApi.Infrastructure.Commands;
using CrushingPlantApi.Models;
using Npgsql;

namespace CrushingPlantApi.Infrastructure.Repositories
{
    public class EquipmentRepository
    {
        private readonly NpgsqlDataSource _dataSource;

        public EquipmentRepository(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        public async Task<IEnumerable<Equipment>> GetEquipmentsAsync()
        {
            await using var command = _dataSource.CreateCommand(EquipmentSqlCommands.SelectAll);
            await using var reader = await command.ExecuteReaderAsync();

            var result = new List<Equipment>();

            while (await reader.ReadAsync())
            {
                result.Add(new Equipment()
                {
                    Id = reader.GetString(0),
                    Name = reader.GetString(1),
                    Status = reader.GetString(2),
                    Type = reader.GetString(3),
                    UpdatedAt = reader.GetDateTime(4),
                });
            }

            return result;
        }

    }
}
