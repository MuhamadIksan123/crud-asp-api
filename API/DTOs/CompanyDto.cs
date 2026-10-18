using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string About { get; set; }
        public required string LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalJobs { get; set; }
    }

    public class CreateCompanyDto
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string About { get; set; } = string.Empty;

        [Required]
        public IFormFile? Logo { get; set; }

    }

    public class UpdateCompanyDto
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string About { get; set; } = string.Empty;

        public IFormFile? Logo { get; set; }

    }
}