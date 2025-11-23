import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/config';
import './index.scss';
import { SystemTimeMod } from 'mods/system-time-mod';

console.log('SystemTimeMod: Development mode started');

// Создаем контейнер для виджета (имитируем игровое окружение)
const container = document.createElement('div');
container.id = 'system-time-mod-container';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.pointerEvents = 'none';
container.style.zIndex = '999999';

const root = document.getElementById('root');
if (root) {
  root.appendChild(container);
  
  const reactRoot = createRoot(container);
  reactRoot.render(
    <React.StrictMode>
      <SystemTimeMod />
    </React.StrictMode>
  );
  
  console.log('SystemTimeMod: Development UI mounted');
}
