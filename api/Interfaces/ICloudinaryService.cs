using System;
using CloudinaryDotNet.Actions;

namespace api.Interfaces;

public interface ICloudinaryService
{
    Task<bool> Upload(IFormFile file);
}
