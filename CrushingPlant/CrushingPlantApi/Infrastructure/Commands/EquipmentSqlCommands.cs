namespace CrushingPlantApi.Infrastructure.Commands
{
    public static class EquipmentSqlCommands
    {
        public static string SelectAll = """
                SELECT id, name, status, type, updated_at FROM equipments
                """;
        public static string UpdateStatusesRandomly = """
                UPDATE equipments
                SET status = CASE
                    WHEN random() < 0.5 THEN 'OFF'
                    WHEN random() < 0.95 THEN 'RUN'
                    ELSE 'ALARM'
                END,
                updated_at = NOW();
                """;
        public static string UpdateStatusById = """
                UPDATE equipments
                SET status = ($1), updated_at = ($2)
                WHERE id = ($3)
                """;
    }
}
