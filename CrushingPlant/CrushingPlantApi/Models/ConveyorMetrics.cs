namespace CrushingPlantApi.Models
{
    public class ConveyorMetrics
    {
        public string EquipmentId { get; set; } = null!;
        public float? Speed { get; set; }
        public DateTime? MetricsUpdatedAt { get; set; }
    }
}
