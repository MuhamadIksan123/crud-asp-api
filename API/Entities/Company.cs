using System;

namespace API.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string About { get; set; }
        public required string LogoUrl { get; set; }
        public required string LogoPublicId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}