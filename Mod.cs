using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;

namespace SystemTimeMod
{
    public class Mod : IMod
    {
        public static ILog log = LogManager.GetLogger($"{nameof(SystemTimeMod)}.{nameof(Mod)}")
            .SetShowsErrorsInUI(false);
        
        // Добавляем статическую ссылку на экземпляр мода
        public static Mod Instance { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info(nameof(OnLoad));
            
            // Сохраняем ссылку
            Instance = this;

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                log.Info($"Current mod asset at {asset.path}");
            
            // Регистрируем UI систему
            updateSystem.UpdateAt<UISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose()
        {
            log.Info(nameof(OnDispose));
            Instance = null;
        }
    }
}