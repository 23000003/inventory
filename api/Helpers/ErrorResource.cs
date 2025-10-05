
namespace api.Helpers
{
    public static class ErrorResource
    {
        public enum ErrorType
        {
            NotFound,
            Unauthorized,
            NotAllowed,
            BadRequest,
            AlreadyExists,
            InternalServerError
        }

        public static string RESOURCE_NOT_FOUND_WITH_ID(string resource, string? id)
        {
            return $"{resource} not found with id {id}";
        }

        public static string AT_LEAST_ONE_ITEM_REQUIRED(string field)
        {
            return $"At least one {field} is required";
        }

        public static string DATA_ALREADY_EXISTS(string resource, string data)
        {
            return $"{data} already exists in {resource}";
        }

        public static string ERROR_CREATING_RESOURCE(string resource)
        {
            return $"Error creating {resource}";
        }

        public static string ERROR_UPDATING_RESOURCE(string resource)
        {
            return $"Error updating {resource}";
        }

        public static string ERROR_DELETING_RESOURCE(string resource)
        {
            return $"Error deleting {resource}";
        }

    }
}
