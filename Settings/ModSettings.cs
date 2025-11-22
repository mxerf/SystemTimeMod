using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

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
        /// Язык интерфейса (en, ru, и т.д.)
        /// Если null или empty, используется язык игры
        /// </summary>
        [SettingsUISection("General")]
        public string Language { get; set; }

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
        [SettingsUISlider(min = 0, max = 2, step = 1)]
        public int WidgetSize { get; set; }

        /// <summary>
        /// Позиция виджета: 0 = TopRight, 1 = TopLeft, 2 = BottomRight, 3 = BottomLeft
        /// </summary>
        [SettingsUISection("Appearance")]
        [SettingsUISlider(min = 0, max = 3, step = 1)]
        public int WidgetPosition { get; set; }

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

        public override void SetDefaults()
        {
            Language = ""; // Пустая строка = использовать язык игры
            Use24HourFormat = true;
            ShowSeconds = true;
            ShowDate = true;
            WidgetSize = 1; // Средний размер
            WidgetPosition = 0; // Верхний правый угол
            CustomPositionX = 0;
            CustomPositionY = 0;
            UseCustomPosition = false;
        }
        
        public override void Apply()
        {
            base.Apply();
            
            // Уведомляем UISystem об изменении настроек
            try
            {
                if (UISystem.Instance != null)
                {
                    UISystem.Instance.UpdateSettings();
                }
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error applying settings: {e.Message}");
            }
        }
    }
}
