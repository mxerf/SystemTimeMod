import { useState, useEffect } from 'react'

export interface ModSettings {
  language: string
  use24HourFormat: boolean
  showSeconds: boolean
  showDate: boolean
  widgetSize: number
  customPositionX: number
  customPositionY: number
  useCustomPosition: boolean
}

declare global {
  interface Window {
    engine?: {
      on(event: string, callback: (...args: any[]) => void): void
      off(event: string, callback: (...args: any[]) => void): void
      call(method: string, ...args: any[]): Promise<any>
      trigger(event: string, ...args: any[]): void
    }
  }
}

/**
 * Хук для получения настроек мода из C# через engine биндинги
 */
export const useModSettings = (): ModSettings => {
  const [settings, setSettings] = useState<ModSettings>({
    language: '',
    use24HourFormat: true,
    showSeconds: true,
    showDate: true,
    widgetSize: 1,
    customPositionX: 0,
    customPositionY: 0,
    useCustomPosition: false,
  })

  useEffect(() => {
    const updateSettings = (settingsJson: string) => {
      try {
        if (settingsJson && settingsJson !== '{}') {
          const parsed = JSON.parse(settingsJson)
          console.log('SystemTimeMod: Settings received:', parsed)
          setSettings(parsed)
        }
      } catch (error) {
        console.error('SystemTimeMod: Failed to parse settings:', error)
      }
    }

    if (window.engine?.on) {
      // Подписываемся на обновления настроек
      window.engine.on('SystemTimeMod.GetSettings', updateSettings)
      
      // Запрашиваем начальные настройки
      window.engine.call('SystemTimeMod.GetSettings').then(updateSettings).catch(console.error)
    }

    return () => {
      if (window.engine?.off) {
        window.engine.off('SystemTimeMod.GetSettings', updateSettings)
      }
    }
  }, [])

  return settings
}

/**
 * Хук для получения языка игры из C# через engine биндинги
 */
export const useGameLanguage = (): string => {
  const [language, setLanguage] = useState('en-US')

  useEffect(() => {
    if (window.engine?.call) {
      window.engine.call('SystemTimeMod.GetLanguage')
        .then((lang: string) => {
          console.log('SystemTimeMod: Game language:', lang)
          setLanguage(lang || 'en-US')
        })
        .catch(console.error)
    }
  }, [])

  return language
}
