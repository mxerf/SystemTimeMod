import { useState, useEffect } from 'react'
import { bindValue, useValue } from 'cs2/api'

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

/**
 * Хук для получения настроек мода из C# через CS2 API биндинги
 */
export const useModSettings = (): ModSettings => {
  const settingsJson = useValue(bindValue('SystemTimeMod', 'GetSettings', '{}'))
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
    try {
      if (settingsJson && settingsJson !== '{}') {
        const parsed = JSON.parse(settingsJson)
        console.log('SystemTimeMod: Settings received from C#:', settingsJson)
        setSettings(parsed)
      }
    } catch (error) {
      console.error('SystemTimeMod: Failed to parse settings:', error)
    }
  }, [settingsJson])

  return settings
}

/**
 * Хук для получения языка игры из C# через CS2 API биндинги
 */
export const useGameLanguage = (): string => {
  const language = useValue(bindValue('SystemTimeMod', 'GetLanguage', 'en-US'))
  
  useEffect(() => {
    if (language) {
      console.log('SystemTimeMod: Game language:', language)
    }
  }, [language])
  
  return language || 'en-US'
}
