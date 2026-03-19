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

        public static string UpdateConveyorsRandomly = """
                UPDATE conveyor_metrics
                SET "speed_m/s" = CASE
                    WHEN "speed_m/s" IS NULL THEN 1.5

                    WHEN random() > 0.8 THEN 
                        "speed_m/s" + 
                        (CASE 
                            WHEN random() < 0.5 THEN 0.1
                            ELSE -0.1
                        END)

                    ELSE "speed_m/s"
                END;
                """;
    }
}
