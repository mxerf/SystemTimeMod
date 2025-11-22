using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;
using SystemTimeMod.Settings;

namespace SystemTimeMod
{
    public class Mod : IMod
    {
        public static ILog log = LogManager.GetLogger($"{nameof(SystemTimeMod)}.{nameof(Mod)}")
            .SetShowsErrorsInUI(false);
        
        // Добавляем статическую ссылку на экземпляр мода
        public static Mod Instance { get; private set; }
        
        // Настройки мода
        public static ModSettings Settings { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info(nameof(OnLoad));
            
            // Сохраняем ссылку
            Instance = this;
            
            // Инициализируем настройки
            Settings = new ModSettings(this);
            Settings.RegisterInOptionsUI();
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(Settings));
            GameManager.instance.localizationManager.AddSource("ru-RU", new LocaleRU(Settings));
            
            AssetDatabase.global.LoadSettings(nameof(SystemTimeMod), Settings, new ModSettings(this));

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                log.Info($"Current mod asset at {asset.path}");
            
            // Регистрируем UI систему
            updateSystem.UpdateAt<UISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose()
        {
            log.Info(nameof(OnDispose));
            
            if (Settings != null)
            {
                Settings.UnregisterInOptionsUI();
                Settings = null;
            }
            
            Instance = null;
        }
    }
}