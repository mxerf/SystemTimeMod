using Game.UI;
using Game;
using Game.SceneFlow;
using Colossal.UI.Binding;
using SystemTimeMod.Settings;
using Unity.Entities;
using System.Text.RegularExpressions;
using System.Globalization;
using System.IO;

namespace SystemTimeMod
{
    public partial class UISystem : UISystemBase
    {
        private GetterValueBinding<string> _settingsBinding;
        private GetterValueBinding<string> _languageBinding;
        private string _jsContent;
        private bool _uiLoaded = false;

        protected override void OnCreate()
        {
            base.OnCreate();
            
            Mod.log.Info("UISystem создаётся...");
            
            // Регистрируем биндинги для передачи данных в React
            AddBinding(_settingsBinding = new GetterValueBinding<string>(
                "SystemTimeMod",
                "GetSettings",
                GetSettings
            ));
            
            AddBinding(_languageBinding = new GetterValueBinding<string>(
                "SystemTimeMod",
                "GetLanguage",
                GetLanguage
            ));
            
            // Биндинг для сохранения позиции виджета из React
            AddBinding(new CallBinding<string, string>(
                "SystemTimeMod",
                "SaveWidgetPosition",
                SaveWidgetPosition
            ));
            
            // Загружаем JS для прямого монтирования
            LoadUIAssets();
            
            Mod.log.Info("UISystem биндинги зарегистрированы. UI модуль будет загружен игрой автоматически.");
        }
        
        private void LoadUIAssets()
        {
            try
            {
                if (GameManager.instance.modManager.TryGetExecutableAsset(Mod.Instance, out var asset))
                {
                    var modPath = Path.GetDirectoryName(asset.path);
                    var jsPath = Path.Combine(modPath, "SystemTimeMod.mjs");
                    
                    if (File.Exists(jsPath))
                    {
                        _jsContent = File.ReadAllText(jsPath);
                        Mod.log.Info($"SystemTimeMod: Loaded UI assets from {jsPath}, size: {_jsContent.Length} bytes");
                    }
                    else
                    {
                        Mod.log.Warn($"SystemTimeMod: UI assets not found at {jsPath}");
                    }
                }
                else
                {
                    Mod.log.Error("SystemTimeMod: Could not get mod asset path");
                }
            }
            catch (System.Exception ex)
            {
                Mod.log.Error($"SystemTimeMod: Error loading UI assets: {ex}");
            }
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
            Mod.log.Info("UISystem уничтожена");
        }
        
        protected override void OnUpdate()
        {
            base.OnUpdate();
            
            // Монтируем UI при первой возможности
            if (!_uiLoaded && !string.IsNullOrEmpty(_jsContent) && GameManager.instance?.userInterface != null)
            {
                try
                {
                    GameManager.instance.userInterface.view.View.ExecuteScript(_jsContent);
                    _uiLoaded = true;
                    Mod.log.Info("SystemTimeMod: UI mounted via ExecuteScript");
                }
                catch (System.Exception ex)
                {
                    Mod.log.Error($"SystemTimeMod: Error mounting UI: {ex}");
                }
            }
            
            // Обновляем биндинги при изменении настроек
            _settingsBinding?.Update();
            _languageBinding?.Update();
        }
        
        /// <summary>
        /// Возвращает настройки мода в формате JSON для React
        /// </summary>
        private string GetSettings()
        {
            try
            {
                // Ручная сериализация в JSON
                var json = $@"{{
                    ""language"": ""{Mod.Settings.LanguagePreference ?? ""}"",
                    ""use24HourFormat"": {Mod.Settings.Use24HourFormat.ToString().ToLower()},
                    ""showSeconds"": {Mod.Settings.ShowSeconds.ToString().ToLower()},
                    ""showDate"": {Mod.Settings.ShowDate.ToString().ToLower()},
                    ""widgetSize"": {Mod.Settings.WidgetSize},
                    ""customPositionX"": {Mod.Settings.CustomPositionX},
                    ""customPositionY"": {Mod.Settings.CustomPositionY},
                    ""useCustomPosition"": {Mod.Settings.UseCustomPosition.ToString().ToLower()}
                }}";
                
                return json;
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error getting settings: {e.Message}");
                return "{}";
            }
        }
        
        /// <summary>
        /// Возвращает текущий язык игры
        /// </summary>
        private string GetLanguage()
        {
            try
            {
                return GameManager.instance.localizationManager.activeLocaleId;
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error getting game language: {e.Message}");
                return "en-US";
            }
        }
        
        /// <summary>
        /// Сохраняет позицию виджета (вызывается из React)
        /// </summary>
        private string SaveWidgetPosition(string positionJson)
        {
            try
            {
                // Простой парсинг JSON вручную
                var xMatch = System.Text.RegularExpressions.Regex.Match(positionJson, @"""x""\s*:\s*([\d\.-]+)");
                var yMatch = System.Text.RegularExpressions.Regex.Match(positionJson, @"""y""\s*:\s*([\d\.-]+)");
                
                if (xMatch.Success && yMatch.Success)
                {
                    var x = float.Parse(xMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture);
                    var y = float.Parse(yMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture);
                    
                    Mod.Settings.CustomPositionX = x;
                    Mod.Settings.CustomPositionY = y;
                    Mod.Settings.UseCustomPosition = true;
                    Mod.Settings.ApplyAndSave();
                    
                    Mod.log.Info($"Widget position saved: x={x}, y={y}");
                }
                
                return "";
            }
            catch (System.Exception e)
            {
                Mod.log.Error($"Error saving widget position: {e.Message}");
                return "";
            }
        }
    }
}