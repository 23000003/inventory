using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using api.Configurations;
using api.Interfaces.Services;

namespace api.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinaryConfig _config;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IOptions<CloudinaryConfig> options, ILogger<CloudinaryService> logger)
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
            this._logger = logger;
        }


        public async Task<string?> UploadImageAsync(IFormFile file)
        {
            try
            {
                await using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "xclone",
                    UseFilename = true,
                    UniqueFilename = true,
                    Overwrite = false,
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }

                return null;
            }
            catch
            {
                throw;
            }
        }
    }
}
