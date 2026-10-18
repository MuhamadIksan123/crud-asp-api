using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class CompanyExtensions
    {
        public static CompanyDto ToDto(this Company Company)
        {
            return new CompanyDto
            {
                Id = Company.Id,
                Name = Company.Name,
                About = Company.About,
                LogoUrl = Company.LogoUrl,
                CreatedAt = Company.CreatedAt,
                TotalJobs = 0,
                // TotalJobs = Company.CompanyJobs != null ? Company.CompanyJobs.Count : 0
            };
        }

        public static async Task<Company?> GetCompanyByIdAsync(this DbSet<Company> categories, int id, bool includeJobs = false)
        {
            var query = categories.AsQueryable();
            // if (includeJobs) query = query.Include(x => x.CompanyJobs);
            return await query.FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);
        }

        public static IQueryable<Company> Search(this IQueryable<Company> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;
            var lowwerCaseSearchTerm = searchTerm.Trim().ToLower();
            return query.Where(x => x.Name.ToLower().Contains(lowwerCaseSearchTerm));
        }
    }
}