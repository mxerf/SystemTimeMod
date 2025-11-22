using Colossal.UI.Binding;
using Game.UI;
using System;

namespace SystemTimeMod.Settings
{
    /// <summary>
    /// Биндинги для передачи настроек между C# и JavaScript/React
    /// </summary>
    public class SettingsBindings : IJsonWritable
    {
        private readonly ModSettings _settings;

        public SettingsBindings(ModSettings settings)
        {
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        }

        public void Write(IJsonWriter writer)
        {
            writer.TypeBegin(GetType().FullName);
            
            // Передаём все настройки в JavaScript
            writer.PropertyName("language");
            writer.Write(_settings.Language ?? "");
            
            writer.PropertyName("use24HourFormat");
            writer.Write(_settings.Use24HourFormat);
            
            writer.PropertyName("showSeconds");
            writer.Write(_settings.ShowSeconds);
            
            writer.PropertyName("showDate");
            writer.Write(_settings.ShowDate);
            
            writer.PropertyName("widgetSize");
            writer.Write(_settings.WidgetSize);
            
            writer.PropertyName("customPositionX");
            writer.Write(_settings.CustomPositionX);
            
            writer.PropertyName("customPositionY");
            writer.Write(_settings.CustomPositionY);
            
            writer.PropertyName("useCustomPosition");
            writer.Write(_settings.UseCustomPosition);
            
            writer.TypeEnd();
        }
    }
}
