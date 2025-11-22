import { useState, useEffect } from 'react'

export interface ModSettings {
  language: string
  use24HourFormat: boolean
  showSeconds: boolean
  showDate: boolean
  widgetSize: number
  widgetPosition: number
  customPositionX: number
  customPositionY: number
  useCustomPosition: boolean
}

// Объявляем глобальный интерфейс для данных мода
declare global {
  interface Window {
    __SYSTEM_TIME_MOD_DATA__?: {
      settings: ModSettings
      gameLanguage: string
    }
    engine?: {
      on: (event: string, callback: (data: any) => void) => void
      off: (event: string, callback: (data: any) => void) => void
      trigger: (event: string, ...args: any[]) => void
      call: (method: string, ...args: any[]) => Promise<any>
    }
  }
}

/**
 * Хук для получения настроек мода из C#
 */
export const useModSettings = (): ModSettings | null => {
  const [settings, setSettings] = useState<ModSettings | null>(null)

  useEffect(() => {
    // Проверяем, есть ли данные в глобальном объекте
    const checkForData = () => {
      if (window.__SYSTEM_TIME_MOD_DATA__?.settings) {
        console.log('Settings loaded from global object:', window.__SYSTEM_TIME_MOD_DATA__.settings)
        setSettings(window.__SYSTEM_TIME_MOD_DATA__.settings)
        return true
      }
      return false
    }

    // Пытаемся загрузить сразу
    if (checkForData()) {
      // Продолжаем проверять обновления
    } else {
      console.log('Waiting for mod data...')
    }

    // Постоянно проверяем обновления настроек (каждые 500мс)
    const interval = setInterval(() => {
      checkForData()
    }, 500)

    // Очистка через 5 секунд если данные так и не появились впервые
    const timeout = setTimeout(() => {
      if (!settings) {
        console.warn('Mod data not found, using defaults')
        setSettings({
          language: '',
          use24HourFormat: true,
          showSeconds: true,
          showDate: true,
          widgetSize: 1,
          widgetPosition: 0,
          customPositionX: 0,
          customPositionY: 0,
          useCustomPosition: false,
        })
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return settings
}

/**
 * Хук для получения языка игры
 */
export const useGameLanguage = (): string => {
  const [language, setLanguage] = useState('en-US')

  useEffect(() => {
    // Проверяем данные в глобальном объекте
    const checkForLanguage = () => {
      if (window.__SYSTEM_TIME_MOD_DATA__?.gameLanguage) {
        console.log('Game language loaded:', window.__SYSTEM_TIME_MOD_DATA__.gameLanguage)
        setLanguage(window.__SYSTEM_TIME_MOD_DATA__.gameLanguage)
        return true
      }
      return false
    }

    // Пытаемся загрузить сразу
    if (checkForLanguage()) {
      return
    }

    // Если данных нет, ждём их появления
    const interval = setInterval(() => {
      if (checkForLanguage()) {
        clearInterval(interval)
      }
    }, 100)

    // Очистка через 5 секунд
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return language
}
