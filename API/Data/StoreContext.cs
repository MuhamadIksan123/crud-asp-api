using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext(DbContextOptions<StoreContext> options) : DbContext(options)
    {
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<CompanyJob> CompanyJobs => Set<CompanyJob>();
        public DbSet<JobResponsibility> JobResponsibilities => Set<JobResponsibility>();
        public DbSet<JobQualification> JobQualifications => Set<JobQualification>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<CompanyJob>()
                .HasOne(x => x.Company)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CompanyJob>()
                .HasOne(x => x.Company)
                .WithMany()
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<JobResponsibility>()
                .HasOne(x => x.CompanyJob)
                .WithMany(x => x.Responsibilities)
                .HasForeignKey(x => x.CompanyJobId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<JobQualification>()
                .HasOne(x => x.CompanyJob)
                .WithMany(x => x.Qualifications)
                .HasForeignKey(x => x.CompanyJobId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}