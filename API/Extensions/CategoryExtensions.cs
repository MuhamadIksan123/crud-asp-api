using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class CategoryExtensions
    {
        public static CategoryDto ToDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                TotalJobs = 0,
                // TotalJobs = category.CompanyJobs != null ? category.CompanyJobs.Count : 0
            };
        }

        public static async Task<Category?> GetCategoryByIdAsync(this DbSet<Category> categories, int id, bool includeJobs = false)
        {
            var query = categories.AsQueryable();
            // if (includeJobs) query = query.Include(x => x.CompanyJobs);
            return await query.FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);
        }

        public static IQueryable<Category> Search(this IQueryable<Category> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;
            var lowwerCaseSearchTerm = searchTerm.Trim().ToLower();
            return query.Where(x => x.Name.ToLower().Contains(lowwerCaseSearchTerm));
        }
    }
}