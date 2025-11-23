import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n/config'

// Монтируем приложение в DOM
const mountApp = () => {
  console.log('SystemTimeMod: Mounting React app')
  
  let container = document.getElementById('system-time-mod-root')
  if (!container) {
    container = document.createElement('div')
    container.id = 'system-time-mod-root'
    container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;'
    document.body.appendChild(container)
  }

  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('SystemTimeMod: React app mounted')
}

// Монтируем после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  setTimeout(mountApp, 100)
}

// Экспортируем для возможного вызова извне
export default mountApp
