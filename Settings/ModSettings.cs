using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;
using Game.UI.Widgets;

namespace SystemTimeMod.Settings
{
    /// <summary>
    /// Настройки мода для SystemTimeMod
    /// </summary>
    [FileLocation("ModsSettings/SystemTimeMod/SystemTimeMod")]
    public class ModSettings : ModSetting
    {
        public ModSettings(IMod mod) : base(mod)
        {
            SetDefaults();
        }

        /// <summary>
        /// Язык интерфейса: "" = Auto (язык игры), "en-US" = English, "ru-RU" = Russian
        /// </summary>
        [SettingsUISection("General")]
        [SettingsUIDropdown(typeof(ModSettings), nameof(GetLanguageValues))]
        public string LanguagePreference { get; set; }

        /// <summary>
        /// Формат времени: true = 24-часовой, false = 12-часовой
        /// </summary>
        [SettingsUISection("Time")]
        public bool Use24HourFormat { get; set; }

        /// <summary>
        /// Показывать секунды
        /// </summary>
        [SettingsUISection("Time")]
        public bool ShowSeconds { get; set; }

        /// <summary>
        /// Показывать дату
        /// </summary>
        [SettingsUISection("Time")]
        public bool ShowDate { get; set; }

        /// <summary>
        /// Размер виджета: 0 = маленький, 1 = средний, 2 = большой
        /// </summary>
        [SettingsUISection("Appearance")]
        [SettingsUIDropdown(typeof(ModSettings), nameof(GetSizeValues))]
        public int WidgetSize { get; set; }

        /// <summary>
        /// Сохранённая позиция X для перетаскивания
        /// </summary>
        [SettingsUIHidden]
        public float CustomPositionX { get; set; }

        /// <summary>
        /// Сохранённая позиция Y для перетаскивания
        /// </summary>
        [SettingsUIHidden]
        public float CustomPositionY { get; set; }

        /// <summary>
        /// Использовать пользовательскую позицию (после перетаскивания)
        /// </summary>
        [SettingsUIHidden]
        public bool UseCustomPosition { get; set; }

        /// <summary>
        /// Информация о версии мода
        /// </summary>
        [SettingsUISection("About")]
        [SettingsUIDisableByCondition(typeof(ModSettings), nameof(AlwaysDisabled))]
        public string ModVersion => SystemTimeMod.ModVersion.FullVersion;
        
        /// <summary>
        /// Номер сборки
        /// </summary>
        [SettingsUISection("About")]
        [SettingsUIDisableByCondition(typeof(ModSettings), nameof(AlwaysDisabled))]
        public int BuildNumber => SystemTimeMod.ModVersion.BuildNumber;
        
        // Вспомогательный метод для отключения полей
        public bool AlwaysDisabled() => true;

        public override void SetDefaults()
        {
            LanguagePreference = ""; // Auto - использовать язык игры
            Use24HourFormat = true;
            ShowSeconds = true;
            ShowDate = true;
            WidgetSize = 1; // Средний размер
            CustomPositionX = 0;
            CustomPositionY = 0;
            UseCustomPosition = false;
        }
        
        public override void Apply()
        {
            base.Apply();
            // Биндинги обновляются автоматически в UISystem.OnUpdate()
        }

        public static DropdownItem<string>[] GetLanguageValues()
        {
            DropdownItem<string>[] list = [
                new DropdownItem<string>
                {
                    value = "",
                    displayName = "SystemTimeMod_Language_Auto"
                },
                new DropdownItem<string>
                {
                    value = "en-US",
                    displayName = "SystemTimeMod_Language_English"
                },
                new DropdownItem<string>
                {
                    value = "ru-RU",
                    displayName = "SystemTimeMod_Language_Russian"
                }
            ];
            return list;
        }

        public static DropdownItem<int>[] GetSizeValues()
        {
            DropdownItem<int>[] list = [
                new DropdownItem<int>
                {
                    value = 0,
                    displayName = "SystemTimeMod_Size_Small"
                },
                new DropdownItem<int>
                {
                    value = 1,
                    displayName = "SystemTimeMod_Size_Medium"
                },
                new DropdownItem<int>
                {
                    value = 2,
                    displayName = "SystemTimeMod_Size_Large"
                }
            ];
            return list;
        }
    }
}
