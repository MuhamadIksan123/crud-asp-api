
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class CategoriesController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetCategories([FromQuery] CategoryParams categoryParams)
        {
            var query = context.Categories
            .Where(x => x.DeletedAt == null)
            .Search(categoryParams.SearchTerm)
            .OrderBy(x => x.Name)

            .AsQueryable();

            var categories = await PagedList<Category>.ToPagedList(query, categoryParams.PageNumber, categoryParams.PageSize);

            Response.addPaginationHeader(categories.Metadata);

            var categoryDtos = categories.Select(x => x.ToDto()).ToList();

            return categoryDtos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await context.Categories.GetCategoryByIdAsync(id, includeJobs: true);

            if (category == null) return NotFound();

            return category.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromForm] CreateUpdateCategoryDto categoryDto)
        {
            if (await context.Categories.AnyAsync(x => x.Name == categoryDto.Name && x.DeletedAt == null)) return BadRequest("Category name already exist");

            var category = new Category
            {
                Name = categoryDto.Name
            };

            context.Categories.Add(category);

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category.ToDto());
            }

            return BadRequest("Problem creating new category");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, [FromForm] CreateUpdateCategoryDto categoryDto)
        {
            var category = await context.Categories.GetCategoryByIdAsync(id, includeJobs: false);

            if (category == null) return NotFound();

            if (await context.Categories.AnyAsync(x => x.Name == categoryDto.Name && x.Id != id && x.DeletedAt == null)) return BadRequest("Category name already exist");

            category.Name = categoryDto.Name;
            category.UpdatedAt = DateTime.UtcNow;

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                return NoContent();
            }

            return BadRequest("Problem updating new category");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await context.Categories.FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);

            if (category == null) return NotFound();

            category.DeletedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;

            var result = await context.SaveChangesAsync() > 0;

            if (result)
            {
                return NoContent();
            }

            return BadRequest("Problem deleting category");
        }
    }
}