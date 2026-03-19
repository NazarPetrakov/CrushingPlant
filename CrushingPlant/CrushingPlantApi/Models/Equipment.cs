namespace CrushingPlantApi.Models
{
    public class Equipment
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}
