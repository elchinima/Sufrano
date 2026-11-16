namespace Rednest.Api.Helpers;

public class ErrorLocalizationFilter : IAlwaysRunResultFilter
{
    public void OnResultExecuting(ResultExecutingContext context)
    {
        if (context.Result is ObjectResult objectResult && objectResult.Value != null)
        {
            var lang = ErrorLocalizer.GetLanguage(context.HttpContext);
            objectResult.Value = LocalizeResponseValue(objectResult.Value, lang);
        }
    }

    public void OnResultExecuted(ResultExecutedContext context)
    {
    }

    private static object LocalizeResponseValue(object value, string lang)
    {
        if (value is string strVal)
        {
            return ErrorLocalizer.Localize(strVal, lang);
        }

        if (value is IDictionary<string, object?> dictObj)
        {
            foreach (var key in dictObj.Keys.ToList())
            {
                if (key.Equals("message", StringComparison.OrdinalIgnoreCase) && dictObj[key] is string msg)
                {
                    dictObj[key] = ErrorLocalizer.Localize(msg, lang);
                }
            }
            return dictObj;
        }

        if (value is IDictionary<string, string> dictStr)
        {
            foreach (var key in dictStr.Keys.ToList())
            {
                if (key.Equals("message", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(dictStr[key]))
                {
                    dictStr[key] = ErrorLocalizer.Localize(dictStr[key], lang);
                }
            }
            return dictStr;
        }

        var type = value.GetType();
        var messageProp = type.GetProperty("message", System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.IgnoreCase);
        if (messageProp != null && messageProp.PropertyType == typeof(string))
        {
            var rawMessage = messageProp.GetValue(value) as string;
            if (!string.IsNullOrEmpty(rawMessage))
            {
                var localized = ErrorLocalizer.Localize(rawMessage, lang);
                var newDict = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                foreach (var prop in type.GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance))
                {
                    newDict[prop.Name] = prop.GetValue(value);
                }
                newDict[messageProp.Name] = localized;
                return newDict;
            }
        }

        return value;
    }
}
