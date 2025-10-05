using System;
using CloudinaryDotNet.Actions;

namespace api.Interfaces.Services;

public interface ICloudinaryService
{
    Task<string?> UploadImageAsync(IFormFile file);
}
