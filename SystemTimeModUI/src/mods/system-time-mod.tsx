import { useModSettings, useGameLanguage } from '../hooks/useModSettings'
import { TimeDisplay } from '../components/TimeDisplay'
import { useEffect } from 'react'
import { setLanguageFromGame } from '../i18n/config'

export const SystemTimeMod = () => {
  const settings = useModSettings()
  const gameLanguage = useGameLanguage()

  useEffect(() => {
    console.log('SystemTimeMod: App mounted!')
    console.log('SystemTimeMod: Settings:', JSON.stringify(settings))
  }, [])

  // Обновляем язык i18n при изменении языка игры
  useEffect(() => {
    if (gameLanguage) {
      setLanguageFromGame(gameLanguage)
      console.log('SystemTimeMod: Language set to:', JSON.stringify(gameLanguage))
    }
  }, [gameLanguage])

  return (
    <div id="system-time-mod-root" style={{ 
      position: 'absolute', 
      top: '16px', 
      right: '16px'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <TimeDisplay settings={settings} />
      </div>
    </div>
  )
}
