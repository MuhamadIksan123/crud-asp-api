using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class CompanyJob
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; }
        public required string Location { get; set; }
        public required string SkillLevel { get; set; }
        public required long Salary { get; set; }
        public required string About { get; set; }
        public bool IsOpen { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public ICollection<JobResponsibility> Responsibilities { get; set; } = [];
        public ICollection<JobQualification> Qualifications { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}