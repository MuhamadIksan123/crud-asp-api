using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CompanyJobsController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<CompanyJobDetailDto>>> GetCompanyJobs([FromQuery] CompanyJobParams companyJobParams)
        {
            var query = context.CompanyJobs
                .Include(x => x.Company)
                .Include(x => x.Category)
                .Search(companyJobParams)
                .OrderByDescending(x => x.Id)
                .AsQueryable();

            var companyJobs = await PagedList<CompanyJob>.ToPagedList(query, companyJobParams.PageNumber, companyJobParams.PageSize);

            Response.addPaginationHeader(companyJobs.Metadata);

            var companyJobDtos = companyJobs.Select(x => x.ToDto()).ToList();

            return companyJobDtos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyJobDetailDto>> GetJob(int id)
        {
            var companyJob = await context.CompanyJobs
                .Include(x => x.Company)
                .Include(x => x.Category)
                .Include(x => x.Responsibilities)
                .Include(x => x.Qualifications)
                .FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);

            if (companyJob is null) return NotFound();

            return companyJob.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CompanyJobDetailDto>> CreateJob([FromForm] CreateUpdateCompanyJobDto dto)
        {
            if (await context.CompanyJobs.AnyAsync(x => x.Name == dto.Name && x.CompanyId == dto.CompanyId && x.DeletedAt == null)) return BadRequest("Company Job name already exist in this Company");

            var company = await context.Companies.FindAsync(dto.CompanyId);
            if (company is null) return BadRequest("Company not found.");

            var category = await context.Categories.FindAsync(dto.CategoryId);
            if (category is null) return BadRequest("Category not found.");

            Console.WriteLine($"Jumlah Responsibilities: {dto.Responsibilities.Count} -> Items: {string.Join(" | ", dto.Responsibilities)}");
            Console.WriteLine($"Jumlah Qualifications: {dto.Qualifications.Count} -> Items: {string.Join(" | ", dto.Qualifications)}");

            if (dto.Responsibilities.Count == 0 || dto.Qualifications.Count == 0) return BadRequest("Responsibilites and qualifications ar required");

            var companyJob = new CompanyJob
            {
                Name = dto.Name,
                Type = dto.Type,
                Location = dto.Location,
                SkillLevel = dto.SkillLevel,
                Salary = dto.Salary,
                About = dto.About,
                IsOpen = dto.IsOpen,
                CompanyId = dto.CompanyId,
                CategoryId = dto.CategoryId
            };

            foreach (var item in dto.Responsibilities.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                companyJob.Responsibilities.Add(new JobResponsibility { Name = item.Trim() });
            }

            foreach (var item in dto.Qualifications.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                companyJob.Qualifications.Add(new JobQualification { Name = item.Trim() });
            }

            context.CompanyJobs.Add(companyJob);

            if (await context.SaveChangesAsync() <= 0) return BadRequest("Problem creating job.");

            return CreatedAtAction(nameof(GetJob), new { id = companyJob.Id }, companyJob.ToDto());
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CompanyJobDetailDto>> UpdateJob(int id, [FromForm] CreateUpdateCompanyJobDto dto)
        {
            if (await context.CompanyJobs.AnyAsync(x => x.Name == dto.Name && x.CompanyId == dto.CompanyId && x.Id != id && x.DeletedAt == null)) return BadRequest("Company Job name already exist in this Company");

            var companyJob = await context.CompanyJobs.GetCompanyJobByIdAsync(id, includeDetails: true);
            if (companyJob is null) return NotFound();

            if (dto.Responsibilities.Count == 0 || dto.Qualifications.Count == 0) return BadRequest("Responsibilites and qualifications ar required");

            companyJob.Name = dto.Name;
            companyJob.Type = dto.Type;
            companyJob.Location = dto.Location;
            companyJob.SkillLevel = dto.SkillLevel;
            companyJob.Salary = dto.Salary;
            companyJob.About = dto.About;
            companyJob.CompanyId = dto.CompanyId;
            companyJob.CategoryId = dto.CategoryId;
            companyJob.IsOpen = dto.IsOpen;
            companyJob.UpdatedAt = DateTime.UtcNow;

            context.JobResponsibilities.RemoveRange(companyJob.Responsibilities);
            context.JobQualifications.RemoveRange(companyJob.Qualifications);

            foreach (var item in dto.Responsibilities.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                companyJob.Responsibilities.Add(new JobResponsibility { Name = item.Trim() });
            }

            foreach (var item in dto.Qualifications.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                companyJob.Qualifications.Add(new JobQualification { Name = item.Trim() });
            }

            if (await context.SaveChangesAsync() <= 0) return BadRequest("Problem creating job.");


            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteJob(int id)
        {
            var companyJob = await context.CompanyJobs.GetCompanyJobByIdAsync(id, includeDetails: true);
            if (companyJob is null) return NotFound();

            companyJob.DeletedAt = DateTime.UtcNow;
            companyJob.UpdatedAt = DateTime.UtcNow;

            foreach (var item in companyJob.Responsibilities) item.DeletedAt = DateTime.UtcNow;
            foreach (var item in companyJob.Qualifications) item.DeletedAt = DateTime.UtcNow;

            if (await context.SaveChangesAsync() <= 0) return BadRequest("Problem deleting job.");

            return NoContent();
        }
    }
}