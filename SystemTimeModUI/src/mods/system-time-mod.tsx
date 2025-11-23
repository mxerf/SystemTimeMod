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

  // Обновляем язык i18n при изменении настроек языка
  useEffect(() => {
    // Если в настройках выбран конкретный язык - используем его
    // Если пусто (Auto) - используем язык игры
    const languageToUse = settings.language || gameLanguage
    
    if (languageToUse) {
      setLanguageFromGame(languageToUse)
      console.log('SystemTimeMod: Language set to:', JSON.stringify(languageToUse))
    }
  }, [settings.language, gameLanguage])

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
