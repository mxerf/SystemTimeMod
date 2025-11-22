import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n/config' // Инициализация i18n

// Функция для монтирования приложения
function mountApp() {
  console.log('SystemTimeMod: Монтируем React приложение...')
  
  // Создаём контейнер
  let container = document.getElementById('system-time-mod-root')
  
  if (!container) {
    container = document.createElement('div')
    container.id = 'system-time-mod-root'
    container.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 999999;'
    document.body.appendChild(container)
  }
  
  // Монтируем React
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('SystemTimeMod: React приложение смонтировано!')
}

// Запускаем сразу или ждём DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  setTimeout(mountApp, 100) // Небольшая задержка для надёжности
}

// Экспортируем для возможного вызова извне
;(window as any).mountSystemTimeMod = mountApp