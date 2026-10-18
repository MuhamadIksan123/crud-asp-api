
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelper;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class CompaniesController(StoreContext context, ImageService imageService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<CompanyDto>>> GetCompanies([FromQuery] CompanyParams companyParams)
        {
            var query = context.Companies
            .Where(x => x.DeletedAt == null)
            .Search(companyParams.SearchTerm)
            .OrderBy(x => x.Name)
            .AsQueryable();

            var categories = await PagedList<Company>.ToPagedList(query, companyParams.PageNumber, companyParams.PageSize);

            Response.addPaginationHeader(categories.Metadata);

            var companyDtos = categories.Select(x => x.ToDto()).ToList();

            return companyDtos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetCompany(int id)
        {
            var company = await context.Companies.GetCompanyByIdAsync(id, includeJobs: true);

            if (company == null) return NotFound();

            return company.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CompanyDto>> CreateCompany([FromForm] CreateCompanyDto companyDto)
        {
            if (await context.Companies.AnyAsync(x => x.Name == companyDto.Name && x.DeletedAt == null)) return BadRequest("Company name already exist");

            if (companyDto.Logo == null) return BadRequest("Logo is required");

            var imageResult = await imageService.AddImageAsync(companyDto.Logo);

            var company = new Company
            {
                Name = companyDto.Name,
                About = companyDto.About,
                LogoUrl = imageResult.SecureUrl.AbsoluteUri,
                LogoPublicId = imageResult.PublicId
            };

            context.Companies.Add(company);

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company.ToDto());
            }

            return BadRequest("Problem creating new company");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompanyDto>> UpdateCompany(int id, [FromForm] UpdateCompanyDto companyDto)
        {
            var company = await context.Companies.GetCompanyByIdAsync(id, includeJobs: false);

            if (company == null) return NotFound();

            if (await context.Companies.AnyAsync(x => x.Name == companyDto.Name && x.Id != id && x.DeletedAt == null)) return BadRequest("Company name already exist");

            var oldPublicId = company.LogoPublicId;

            company.Name = companyDto.Name;
            company.About = companyDto.Name;
            company.UpdatedAt = DateTime.UtcNow;

            if (companyDto.Logo != null)
            {
                var imageResult = await imageService.AddImageAsync(companyDto.Logo);

                if (imageResult.Error != null)
                    return BadRequest(imageResult.Error.Message);

                company.LogoUrl = imageResult.SecureUrl.AbsoluteUri;
                company.LogoPublicId = imageResult.PublicId;
            }

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                if (companyDto.Logo != null && !string.IsNullOrEmpty(oldPublicId))
                    await imageService.DeleteImageAsync(oldPublicId);
                return NoContent();
            }

            return BadRequest("Problem updating new company");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCompany(int id)
        {
            var company = await context.Companies.FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);

            if (company == null) return NotFound();

            company.DeletedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                if (!string.IsNullOrEmpty(company.LogoPublicId))
                    await imageService.DeleteImageAsync(company.LogoPublicId);

                return NoContent();
            }

            return BadRequest("Problem deleting company");
        }
    }
}