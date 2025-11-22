using Colossal;
using System.Collections.Generic;

namespace SystemTimeMod.Settings
{
    /// <summary>
    /// Английская локализация для настроек мода
    /// </summary>
    public class LocaleEN : IDictionarySource
    {
        private readonly ModSettings _settings;

        public LocaleEN(ModSettings settings)
        {
            _settings = settings;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                { _settings.GetSettingsLocaleID(), "System Time Mod" },
                { _settings.GetOptionTabLocaleID("General"), "General" },
                { _settings.GetOptionTabLocaleID("Time"), "Time Display" },
                { _settings.GetOptionTabLocaleID("Appearance"), "Appearance" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Language)), "Language" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Language)), "Select interface language (empty = use game language)" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Use24HourFormat)), "24-Hour Format" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Use24HourFormat)), "Use 24-hour time format instead of 12-hour" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowSeconds)), "Show Seconds" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowSeconds)), "Display seconds in the time widget" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowDate)), "Show Date" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowDate)), "Display date when hovering over the widget" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.WidgetSize)), "Widget Size" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.WidgetSize)), "Size of the time widget (0=Small, 1=Medium, 2=Large)" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.WidgetPosition)), "Widget Position" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.WidgetPosition)), "Default position of the widget (0=TopRight, 1=TopLeft, 2=BottomRight, 3=BottomLeft)" },
            };
        }

        public void Unload()
        {
        }
    }
}
