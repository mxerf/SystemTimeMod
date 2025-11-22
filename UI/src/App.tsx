import { useEffect } from 'react'
import { TimeDisplay } from './components/TimeDisplay/TimeDisplay'
import { useModSettings, useGameLanguage } from './hooks/useModSettings'
import { setLanguageFromGame, setLanguage } from './i18n/config'

function App() {
  const settings = useModSettings()
  const gameLanguage = useGameLanguage()

  // Устанавливаем язык при загрузке
  useEffect(() => {
    if (settings) {
      if (settings.language && settings.language !== '') {
        // Используем язык из настроек
        setLanguage(settings.language)
      } else {
        // Используем язык игры
        setLanguageFromGame(gameLanguage)
      }
    }
  }, [settings, gameLanguage])

  return (
    <div className="font-sans antialiased">
      <TimeDisplay settings={settings} />
    </div>
  )
}

export default App