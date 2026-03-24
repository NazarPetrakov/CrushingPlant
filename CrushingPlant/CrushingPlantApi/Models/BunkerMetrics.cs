namespace CrushingPlantApi.Models
{
    public class BunkerMetrics
    {
        public string EquipmentId { get; set; } = null!;
        public short? Level { get; set; }
        public int? Capacity { get; set; }
        public DateTime? MetricsUpdatedAt { get; set; }
    }
}
