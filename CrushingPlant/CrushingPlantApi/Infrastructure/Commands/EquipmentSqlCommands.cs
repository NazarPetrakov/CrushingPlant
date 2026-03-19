namespace CrushingPlantApi.Infrastructure.Commands
{
    public static class EquipmentSqlCommands
    {
        public static string SelectAll = """
                SELECT id, name, status, type, updated_at FROM equipments
                """;

    }
}
