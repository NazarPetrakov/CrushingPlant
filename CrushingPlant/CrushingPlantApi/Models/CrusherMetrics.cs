namespace CrushingPlantApi.Models
{
    public class CrusherMetrics
    {
        public string EquipmentId { get; set; } = null!;
        public short? Temperature { get; set; }
        public short? Load { get; set; }
        public short? Power { get; set; }
        public short? FeedingSize { get; set; }
        public short? DischargeSize { get; set; }
        public DateTime? MetricsUpdatedAt { get; set; }
    }
}
