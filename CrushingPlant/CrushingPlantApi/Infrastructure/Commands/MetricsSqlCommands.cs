namespace CrushingPlantApi.Infrastructure.Commands
{
    public static class MetricsSqlCommands
    {
        public static string SelectCrusherMetricsById = """
                SELECT equipment_id, temperature_celsius, load_percentage, 
                    power_kw, feeding_size_mm, discharging_size_mm, updated_at 
                FROM crusher_metrics
                WHERE equipment_id = ($1)
                """;
        public static string SelectConveyorMetricsById = """
                SELECT equipment_id, "speed_m/s", updated_at 
                FROM conveyor_metrics
                WHERE equipment_id = ($1)
                """;
        public static string SelectBunkerMetricsById = """
                SELECT equipment_id, level_percentage, capacity_ton, updated_at 
                FROM bunker_metrics
                WHERE equipment_id = ($1)
                """;


    }
}
