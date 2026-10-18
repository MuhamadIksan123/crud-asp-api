using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.RequestHelper;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class CompanyJobExtensions
    {
        public static CompanyJobDetailDto ToDto(this CompanyJob job)
        {
            return new CompanyJobDetailDto
            {
                Id = job.Id,
                Name = job.Name,
                Type = job.Type,
                Location = job.Location,
                SkillLevel = job.SkillLevel,
                Salary = job.Salary,
                About = job.About,
                IsOpen = job.IsOpen,
                CreatedAt = job.CreatedAt,
                CompanyId = job.CompanyId,
                CompanyName = job.Company?.Name ?? string.Empty,
                CompanyLogo = job.Company?.LogoUrl ?? string.Empty,
                CategoryId = job.CategoryId,
                CategoryName = job.Category?.Name ?? string.Empty,
                Responsibilities = job.Responsibilities?.Select(x => x.Name).ToList() ?? [],
                Qualifications = job.Qualifications?.Select(x => x.Name).ToList() ?? [],
            };
        }

        public static async Task<CompanyJob?> GetCompanyJobByIdAsync(this DbSet<CompanyJob> jobs, int id, bool includeDetails = false)
        {
            var query = jobs.AsQueryable();
            if (includeDetails)
            {
                query = query
                    .Include(x => x.Company)
                    .Include(x => x.Responsibilities)
                    .Include(x => x.Qualifications);
            }
            return await query.FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);
        }

        public static IQueryable<CompanyJob> Search(this IQueryable<CompanyJob> query, CompanyJobParams companyJobParams)
        {
            query = query.Where(x => x.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(companyJobParams.SearchTerm))
            {
                var lowerKeyword = companyJobParams.SearchTerm.Trim().ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(lowerKeyword));
            }

            return query;
        }
    }
}