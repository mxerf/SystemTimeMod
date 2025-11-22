using Game.UI;
using Game;
using Game.SceneFlow;
using Colossal.UI.Binding;
using SystemTimeMod.Settings;
using Unity.Entities;

namespace SystemTimeMod
{
    public partial class UISystem : UISystemBase
    {
        private static UISystem _instance;

        public static UISystem Instance => _instance;

        protected override void OnCreate()
        {
            base.OnCreate();
            
            _instance = this;
            
            Mod.log.Info("UISystem создаётся...");
            
            try
            {
                // Используем сохранённый экземпляр мода
                if (GameManager.instance.modManager.TryGetExecutableAsset(Mod.Instance, out var asset))
                {
                    var modPath = asset.path;
                    var uiFolder = System.IO.Path.GetDirectoryName(modPath);
                    
                    Mod.log.Info($"Путь к моду: {uiFolder}");
                    
                    // Просто загружаем файл напрямую через ExecuteScript
                    var scriptPath = $"{uiFolder}/dist/ui/system-time-mod.js";
                    var scriptContent = System.IO.File.ReadAllText(scriptPath);
                    
                    GameManager.instance.userInterface.view.View.ExecuteScript(scriptContent);
                    
                    Mod.log.Info("JavaScript выполнен!");
                    
                    // Передаём начальные данные в JavaScript
                    InitializeBindings();
                }
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Ошибка загрузки UI: {e.Message}\n{e.StackTrace}");
            }
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
            _instance = null;
            Mod.log.Info("UISystem уничтожена");
        }
        
        /// <summary>
        /// Обновляет настройки в JavaScript (вызывается при изменении настроек через игровое меню)
        /// </summary>
        public void UpdateSettings()
        {
            Mod.log.Info("Обновление настроек в JavaScript...");
            InitializeBindings();
        }
        
        /// <summary>
        /// Инициализирует биндинги и передаёт данные в JavaScript
        /// </summary>
        private void InitializeBindings()
        {
            try
            {
                var gameLanguage = GetGameLanguage();
                
                // Создаём JSON вручную (System.Text.Json недоступен в .NET Framework 4.8)
                var settingsJson = $@"{{
                    ""language"": ""{Mod.Settings.Language ?? ""}"",
                    ""use24HourFormat"": {Mod.Settings.Use24HourFormat.ToString().ToLower()},
                    ""showSeconds"": {Mod.Settings.ShowSeconds.ToString().ToLower()},
                    ""showDate"": {Mod.Settings.ShowDate.ToString().ToLower()},
                    ""widgetSize"": {Mod.Settings.WidgetSize},
                    ""customPositionX"": {Mod.Settings.CustomPositionX},
                    ""customPositionY"": {Mod.Settings.CustomPositionY},
                    ""useCustomPosition"": {Mod.Settings.UseCustomPosition.ToString().ToLower()}
                }}";
                
                var initScript = $@"
                    window.__SYSTEM_TIME_MOD_DATA__ = {{
                        settings: {settingsJson},
                        gameLanguage: '{gameLanguage}'
                    }};
                    console.log('SystemTimeMod: Data initialized', window.__SYSTEM_TIME_MOD_DATA__);
                ";
                
                GameManager.instance.userInterface.view.View.ExecuteScript(initScript);
                Mod.log.Info("Settings and language data sent to JavaScript");
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error initializing bindings: {e.Message}\n{e.StackTrace}");
            }
        }
        
        /// <summary>
        /// Получает текущий язык игры
        /// </summary>
        private string GetGameLanguage()
        {
            try
            {
                var localeId = GameManager.instance.localizationManager.activeLocaleId;
                Mod.log.Info($"Detected game language: {localeId}");
                return localeId;
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error getting game language: {e.Message}");
                return "en-US";
            }
        }
    }
}