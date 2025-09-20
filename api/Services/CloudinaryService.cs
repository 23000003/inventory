using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using api.Configurations;
using api.Interfaces;

namespace api.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinaryConfig _config;

        public CloudinaryService(IOptions<CloudinaryConfig> options)
        {
            this._config = options.Value;

            Account account = new Account(
                this._config.CloudName,
                this._config.ApiSecretKey,
                this._config.ApiSecret
            );

            Cloudinary cloudinary = new(account);
            cloudinary.Api.Secure = true;

            this._cloudinary = cloudinary;
        }


        public async Task<bool> Upload(IFormFile file)
        {
            try
            {
                var uploadParams = new ImageUploadParams()
                {
                    // File = new FileDescription(file.Pat)
                };
                var uploadResult = await this._cloudinary.UploadAsync(uploadParams);
                
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
    }
}
