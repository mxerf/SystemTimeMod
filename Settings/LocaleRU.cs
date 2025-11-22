using Colossal;
using System.Collections.Generic;

namespace SystemTimeMod.Settings
{
    /// <summary>
    /// Русская локализация для настроек мода
    /// </summary>
    public class LocaleRU : IDictionarySource
    {
        private readonly ModSettings _settings;

        public LocaleRU(ModSettings settings)
        {
            _settings = settings;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                { _settings.GetSettingsLocaleID(), "Мод системного времени" },
                { _settings.GetOptionTabLocaleID("General"), "Общие" },
                { _settings.GetOptionTabLocaleID("Time"), "Отображение времени" },
                { _settings.GetOptionTabLocaleID("Appearance"), "Внешний вид" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Language)), "Язык" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Language)), "Выберите язык интерфейса (пусто = использовать язык игры)" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.Use24HourFormat)), "24-часовой формат" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.Use24HourFormat)), "Использовать 24-часовой формат времени вместо 12-часового" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowSeconds)), "Показывать секунды" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowSeconds)), "Отображать секунды в виджете времени" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.ShowDate)), "Показывать дату" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.ShowDate)), "Отображать дату при наведении на виджет" },
                
                { _settings.GetOptionLabelLocaleID(nameof(ModSettings.WidgetSize)), "Размер виджета" },
                { _settings.GetOptionDescLocaleID(nameof(ModSettings.WidgetSize)), "Размер виджета времени" },

                { "SystemTimeMod_Size_Small", "Маленький" },
                { "SystemTimeMod_Size_Medium", "Средний" },
                { "SystemTimeMod_Size_Large", "Большой" },
            };
        }

        public void Unload()
        {
        }
    }
}
