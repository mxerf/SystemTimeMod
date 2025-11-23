import { useModSettings, useGameLanguage } from '../hooks/useModSettings'
import { TimeDisplay } from './TimeDisplay'
import { useEffect } from 'react'
import { setLanguageFromGame } from '../i18n/config'

export const App = () => {
  const settings = useModSettings()
  const gameLanguage = useGameLanguage()

  useEffect(() => {
    console.log('SystemTimeMod: App mounted!')
    console.log('SystemTimeMod: Settings:', settings)
  }, [])

  // Обновляем язык i18n при изменении языка игры
  useEffect(() => {
    if (gameLanguage) {
      setLanguageFromGame(gameLanguage)
      console.log('SystemTimeMod: Language set to:', gameLanguage)
    }
  }, [gameLanguage])

  return (
    <div id="system-time-mod-root" style={{ 
      position: 'fixed', 
      top: '16px', 
      right: '16px',
      zIndex: 999999,
      pointerEvents: 'none'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <TimeDisplay settings={settings} />
      </div>
    </div>
  )
}
