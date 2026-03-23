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
                UPDATE conveyor_metrics cm
                SET 
                    "speed_m/s" = CASE
                        WHEN e.status = 'OFF' THEN NULL
                        WHEN cm."speed_m/s" IS NULL THEN 1.5  -- optional: start speed if null
                        WHEN random() > 0.8 THEN 
                            GREATEST(
                                cm."speed_m/s" + (CASE WHEN random() < 0.5 THEN 0.1 ELSE -0.1 END),
                                0
                            )
                        ELSE cm."speed_m/s"
                    END,
                    updated_at = NOW()
                FROM equipments e
                WHERE cm.equipment_id = e.id;
                """;

        public static string UpdateBunkersRandomly = """
                UPDATE bunker_metrics bm
                SET
                    level_percentage = CASE
                        WHEN e.status = 'OFF' THEN NULL
                        WHEN bm.level_percentage IS NULL THEN 50  -- start at 50% if null
                        ELSE GREATEST(0, LEAST(100,
                            bm.level_percentage + (CASE WHEN random() < 0.5 THEN 5 ELSE -5 END)
                        ))
                    END,
                    updated_at = NOW()
                FROM equipments e
                WHERE bm.equipment_id = e.id;
                """;
        public static string UpdateCrushersRandomly = """
                UPDATE crusher_metrics cm
                SET
                    temperature_celsius = CASE
                        WHEN e.status = 'OFF' THEN NULL
                        WHEN cm.temperature_celsius IS NULL THEN 70
                        ELSE GREATEST(0, cm.temperature_celsius + (CASE WHEN random() < 0.5 THEN 1 ELSE -1 END))
                    END,
                    load_percentage = CASE
                        WHEN e.status = 'OFF' THEN NULL
                        WHEN cm.load_percentage IS NULL THEN 50
                        ELSE GREATEST(0, LEAST(100, cm.load_percentage + (CASE WHEN random() < 0.5 THEN 5 ELSE -5 END)))
                    END,
                    power_kw = CASE
                        WHEN e.status = 'OFF' THEN NULL
                        WHEN cm.power_kw IS NULL THEN 100
                        ELSE GREATEST(0, cm.power_kw + (CASE WHEN random() < 0.5 THEN 2 ELSE -2 END))
                    END,
                    updated_at = NOW()
                FROM equipments e
                WHERE cm.equipment_id = e.id;
                """;
    }
}
