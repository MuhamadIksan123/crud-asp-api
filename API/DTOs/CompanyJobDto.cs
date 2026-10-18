using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CompanyJobDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string CompanyName { get; set; }
        public required string CompanyLogo { get; set; }
        public required string CategoryName { get; set; }
        public required string Location { get; set; }
        public required string Type { get; set; }
        public required string SkillLevel { get; set; }
        public long Salary { get; set; }
        public bool IsOpen { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CompanyJobDetailDto : CompanyJobDto
    {
        public int CompanyId { get; set; }

        public int CategoryId { get; set; }

        public required string About { get; set; }

        public List<string> Responsibilities { get; set; } = [];

        public List<string> Qualifications { get; set; } = [];

        public List<CompanyJobDto> RelatedJobs { get; set; } = [];
    }

    public class CreateUpdateCompanyJobDto
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        [Required, MaxLength(255)]
        public string SkillLevel { get; set; } = string.Empty;
        [Required, MaxLength(255)]
        public string Location { get; set; } = string.Empty;
        [Required, MaxLength(255)]
        public string Type { get; set; } = string.Empty;
        public int Salary { get; set; }
        [Required, MaxLength(255)]
        public string About { get; set; } = string.Empty;
        [Required]
        public List<string> Responsibilities { get; set; } = [];
        [Required]
        public List<string> Qualifications { get; set; } = [];
        public bool IsOpen { get; set; }
    }
}