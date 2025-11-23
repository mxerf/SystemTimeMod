import { createRoot } from 'react-dom/client';
import { ModRegistrar } from "cs2/modding";
import "./i18n/config";
import "./index.scss";
import { SystemTimeMod } from "mods/system-time-mod";

// Прямое монтирование в body для отображения везде
console.log('SystemTimeMod: Initializing UI...');

// Создаем контейнер для виджета
const mountWidget = () => {
    const container = document.createElement('div');
    container.id = 'system-time-mod-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '999999';
    
    document.body.appendChild(container);
    
    const root = createRoot(container);
    root.render(<SystemTimeMod />);
    
    console.log('SystemTimeMod: UI mounted to body');
};

// Монтируем сразу если DOM готов, иначе ждем
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}

// Пустой ModRegistrar для валидации типов (не используется)
const register: ModRegistrar = () => {};
export default register;