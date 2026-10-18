using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class ImageService(IConfiguration configuration)
    {
        private readonly Cloudinary cloudinary = new(new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]));

        public async Task<ImageUploadResult> AddImageAsync(IFormFile file, string folder = "jobportal/categories")
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder
            };

            return await cloudinary.UploadAsync(uploadParams);
        }

        public async Task<RawUploadResult> AddRawAsync(IFormFile file, string folder = "jobportal/resumes")
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder
            };

            return await cloudinary.UploadAsync(uploadParams);
        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            return await cloudinary.DestroyAsync(new DeletionParams(publicId));
        }
    }
}