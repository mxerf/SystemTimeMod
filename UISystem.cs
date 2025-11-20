using Game.UI;
using Game;
using Game.SceneFlow;

namespace SystemTimeMod
{
    public partial class UISystem : UISystemBase
    {
        protected override void OnCreate()
        {
            base.OnCreate();
            
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
            Mod.log.Info("UISystem уничтожена");
        }
    }
}