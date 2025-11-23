import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'

// Маппинг языков Cities Skylines 2 на i18n коды
const languageMap: Record<string, string> = {
  'en-US': 'en',
  'ru-RU': 'ru',
  'de-DE': 'en', // fallback to English
  'fr-FR': 'en',
  'es-ES': 'en',
  'pt-BR': 'en',
  'pl-PL': 'en',
  'zh-HANS': 'en',
  'zh-HANT': 'en',
  'ja-JP': 'en',
  'ko-KR': 'en',
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: 'en', // язык по умолчанию
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

// Функция для установки языка на основе настроек игры
export const setLanguageFromGame = (gameLanguage: string) => {
  const mappedLanguage = languageMap[gameLanguage] || 'en'
  i18n.changeLanguage(mappedLanguage)
}

// Функция для установки языка вручную
export const setLanguage = (language: string) => {
  i18n.changeLanguage(language)
}

export default i18n
