using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ImageService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("client", policy => policy.WithOrigins("https://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// Add services to the container.

var app = builder.Build();

app.UseCors("client");
app.MapControllers();

await DbInitializer.InitDb(app);

app.Run();
