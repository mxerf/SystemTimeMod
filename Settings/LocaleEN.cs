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
                { _settings.GetOptionTabLocaleID("About"), "About" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Language)), "Language" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Language)), "Select interface language (empty = use game language)" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Use24HourFormat)), "24-Hour Format" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Use24HourFormat)), "Use 24-hour time format instead of 12-hour" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowSeconds)), "Show Seconds" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowSeconds)), "Display seconds in the time widget" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowDate)), "Show Date" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowDate)), "Display date when hovering over the widget" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.WidgetSize)), "Widget Size" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.WidgetSize)), "Size of the time widget" },

                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ModVersion)), "Version" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ModVersion)), "Current mod version" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.BuildNumber)), "Build Number" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.BuildNumber)), "Current build number (auto-incremented)" },

                { "SystemTimeMod_Size_Small", "Small" },
                { "SystemTimeMod_Size_Medium", "Medium" },
                { "SystemTimeMod_Size_Large", "Large" }
            };
        }

        public void Unload()
        {
        }
    }
}
