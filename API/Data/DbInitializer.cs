using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task InitDb(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<StoreContext>();

            await context.Database.MigrateAsync();

            // Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                var categories = new[]
                {
                    new Category { Name = "Fullstack" },
                    new Category { Name = "Frontend" },
                    new Category { Name = "Backend" },
                    new Category { Name = "QA Tester" },
                    new Category { Name = "Project Manager" },
                };

                context.Categories.AddRange(categories);
                await context.SaveChangesAsync(); // Simpan dulu agar ID kategori terbentuk
            }

            // Seed 10 Companies dengan LogoUrl Picsum Seed
            if (!await context.Companies.AnyAsync())
            {
                var companies = new[]
                {
                    new Company
                    {
                        Name = "Tech Innovators Inc.",
                        About = "Perusahaan teknologi terdepan yang berfokus pada pengembangan solusi perangkat lunak enterprise dan kecerdasan buatan.",
                        LogoUrl = "https://picsum.photos/seed/tech-innovators/800/600",
                        LogoPublicId = "tech-innovators"
                    },
                    new Company
                    {
                        Name = "Digital Synergy Works",
                        About = "Software house modern yang mengkhususkan diri dalam pembuatan aplikasi web dan mobile berkinerja tinggi.",
                        LogoUrl = "https://picsum.photos/seed/digital-synergy/800/600",
                        LogoPublicId = "digital-synergy"
                    },
                    new Company
                    {
                        Name = "Cloud Native Solutions",
                        About = "Penyedia layanan konsultasi IT dan pengembang infrastruktur cloud terdistribusi.",
                        LogoUrl = "https://picsum.photos/seed/cloud-native/800/600",
                        LogoPublicId = "cloud-native"
                    },
                    new Company
                    {
                        Name = "Nusantara Cyber Media",
                        About = "Perusahaan media digital dan keamanan siber yang berfokus pada perlindungan data enterprise.",
                        LogoUrl = "https://picsum.photos/seed/nusantara-cyber/800/600",
                        LogoPublicId = "nusantara-cyber"
                    },
                    new Company
                    {
                        Name = "DataDynamics Labs",
                        About = "Startup analitik data mutakhir yang membantu bisnis mengoptimalkan keputusan berbasis Data Science dan Big Data.",
                        LogoUrl = "https://picsum.photos/seed/datadynamics/800/600",
                        LogoPublicId = "datadynamics"
                    },
                    new Company
                    {
                        Name = "Fintech Utama Indonesia",
                        About = "Penyedia platform pembayaran digital dan ekosistem keuangan terpadu untuk UMKM.",
                        LogoUrl = "https://picsum.photos/seed/fintech-utama/800/600",
                        LogoPublicId = "fintech-utama"
                    },
                    new Company
                    {
                        Name = "AgroTech Horizons",
                        About = "Perusahaan teknologi pertanian yang menerapkan IoT dan otomasi untuk meningkatkan hasil panen secara berkelanjutan.",
                        LogoUrl = "https://picsum.photos/seed/agrotech-horizons/800/600",
                        LogoPublicId = "agrotech-horizons"
                    },
                    new Company
                    {
                        Name = "OmniChannel Retail Tech",
                        About = "Penyedia solusi e-commerce terpadu dan sistem point-of-sale modern untuk bisnis ritel berskala nasional.",
                        LogoUrl = "https://picsum.photos/seed/omnichannel-retail/800/600",
                        LogoPublicId = "omnichannel-retail"
                    },
                    new Company
                    {
                        Name = "Quantum Code Academy",
                        About = "Lembaga pelatihan teknologi dan sertifikasi bakat digital untuk calon developer profesional.",
                        LogoUrl = "https://picsum.photos/seed/quantum-code/800/600",
                        LogoPublicId = "quantum-code"
                    },
                    new Company
                    {
                        Name = "NextGen AI Labs",
                        About = "Pusat riset dan pengembangan solusi berbasis Machine Learning dan Natural Language Processing.",
                        LogoUrl = "https://picsum.photos/seed/nextgen-ai/800/600",
                        LogoPublicId = "nextgen-ai"
                    }
                };

                context.Companies.AddRange(companies);
                await context.SaveChangesAsync(); // Simpan dulu agar ID perusahaan terbentuk
            }

            // Seed CompanyJobs (Lowongan Pekerjaan)
            if (!await context.CompanyJobs.AnyAsync())
            {
                // Ambil data company dan category yang sudah tersimpan di database untuk relasi ID-nya
                var companyList = await context.Companies.ToListAsync();
                var categoryList = await context.Categories.ToListAsync();

                var companyJobs = new List<CompanyJob>
                {
                    new CompanyJob
                    {
                        Name = "Senior Fullstack Engineer",
                        Type = "Full-time",
                        Location = "Jakarta (Hybrid)",
                        SkillLevel = "Senior",
                        Salary = 15000000,
                        About = "Kami mencari Senior Fullstack Engineer yang berpengalaman untuk membangun arsitektur sistem skala besar.",
                        IsOpen = true,
                        CompanyId = companyList[0].Id,
                        CategoryId = categoryList.First(c => c.Name == "Fullstack").Id,
                        Responsibilities = new List<JobResponsibility>
                        {
                            new JobResponsibility { Name = "Merancang dan mengembangkan aplikasi web skala enterprise." },
                            new JobResponsibility { Name = "Melakukan code review dan mentoring untuk junior developer." }
                        },
                        Qualifications = new List<JobQualification>
                        {
                            new JobQualification { Name = "Pengalaman minimal 5 tahun menggunakan C# .NET dan React." },
                            new JobQualification { Name = "Memahami konsep Clean Architecture dan Microservices." }
                        }
                    },
                    new CompanyJob
                    {
                        Name = "Frontend React Developer",
                        Type = "Remote",
                        Location = "Jakarta",
                        SkillLevel = "Mid-Level",
                        Salary = 10000000,
                        About = "Bergabunglah bersama tim Frontend kami untuk menciptakan antarmuka pengguna yang responsif dan interaktif.",
                        IsOpen = true,
                        CompanyId = companyList[1].Id,
                        CategoryId = categoryList.First(c => c.Name == "Frontend").Id,
                        Responsibilities = new List<JobResponsibility>
                        {
                            new JobResponsibility { Name = "Mengubah desain UI/UX menjadi komponen kode React yang reusable." },
                            new JobResponsibility { Name = "Mengoptimalkan performa web aplikasi." }
                        },
                        Qualifications = new List<JobQualification>
                        {
                            new JobQualification { Name = "Menguasai React.js, TypeScript, dan Redux Toolkit." },
                            new JobQualification { Name = "Familiar dengan Bootstrap atau Tailwind CSS." }
                        }
                    },
                    new CompanyJob
                    {
                        Name = "Backend .NET Core Developer",
                        Type = "Full-time",
                        Location = "Bandung",
                        SkillLevel = "Mid-Level",
                        Salary = 12000000,
                        About = "Mencari backend developer handal untuk mengelola RESTful API dan integrasi database berkecepatan tinggi.",
                        IsOpen = false,
                        CompanyId = companyList[2].Id,
                        CategoryId = categoryList.First(c => c.Name == "Backend").Id,
                        Responsibilities = new List<JobResponsibility>
                        {
                            new JobResponsibility { Name = "Membangun dan memelihara REST API menggunakan ASP.NET Core." },
                            new JobResponsibility { Name = "Mengoptimalkan query Entity Framework Core." }
                        },
                        Qualifications = new List<JobQualification>
                        {
                            new JobQualification { Name = "Menguasai C#, LINQ, dan SQL Server." },
                            new JobQualification { Name = "Memahami sistem autentikasi JWT dan OAuth." }
                        }
                    }
                };

                context.CompanyJobs.AddRange(companyJobs);
                await context.SaveChangesAsync();
            }
        }
    }
}