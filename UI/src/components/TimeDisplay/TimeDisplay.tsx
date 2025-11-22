import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Calendar, Wifi, Move } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ModSettings } from '../../hooks/useModSettings'

// Размеры виджета
const WIDGET_SIZES = {
  small: {
    padding: '12px 16px',
    iconSize: 32,
    iconWrapperSize: 32,
    fontSize: '20px',
    dotSize: 6,
    expandedFontSize: '12px',
    borderRadius: '16px',
    dotsMargin: '2px',
    timeMargin: '12px'
  },
  medium: {
    padding: '16px 24px',
    iconSize: 40,
    iconWrapperSize: 40,
    fontSize: '28px',
    dotSize: 8,
    expandedFontSize: '14px',
    borderRadius: '16px',
    dotsMargin: '4px',
    timeMargin: '16px'
  },
  large: {
    padding: '20px 32px',
    iconSize: 48,
    iconWrapperSize: 48,
    fontSize: '36px',
    dotSize: 10,
    expandedFontSize: '16px',
    borderRadius: '20px',
    dotsMargin: '4px',
    timeMargin: '16px'
  },
} as const

type WidgetSizeName = 'small' | 'medium' | 'large'
type WidgetSizeConfig = typeof WIDGET_SIZES[WidgetSizeName]

function getWidgetSize(sizeIndex: number): WidgetSizeConfig {
  const sizes: WidgetSizeName[] = ['small', 'medium', 'large']
  const sizeName = sizes[sizeIndex] || 'medium'
  return WIDGET_SIZES[sizeName]
}

// Функция для форматирования даты вручную
function formatDate(date: Date, locale: string): string {
  const months = locale === 'ru-RU' ? [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return locale === 'ru-RU'
    ? `${day} ${month} ${year}`
    : `${month} ${day}, ${year}`
}

interface TimeDisplayProps {
  settings: ModSettings | null
}

export const TimeDisplay = ({ settings }: TimeDisplayProps) => {
  const { t } = useTranslation()
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' })
  const [date, setDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Используем сохранённую позицию или дефолтную
  useEffect(() => {
    if (settings?.useCustomPosition) {
      setPosition({ x: settings.customPositionX, y: settings.customPositionY })
    }
  }, [settings])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      // Применяем формат 12/24 часа
      const use24Hour = settings?.use24HourFormat ?? true
      let hoursStr: string
      if (!use24Hour) {
        hours = hours % 12 || 12
        hoursStr = String(hours).padStart(2, '0')
      } else {
        hoursStr = String(hours).padStart(2, '0')
      }

      // Получаем язык для форматирования даты
      const locale = settings?.language || 'ru-RU'
      const dateString = formatDate(now, locale === 'en' ? 'en-US' : 'ru-RU')

      setTime({ hours: hoursStr, minutes, seconds })
      setDate(dateString)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [settings])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        // Сохраняем позицию в настройках
        savePosition(position.x, position.y)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, position])

  // Функция для сохранения позиции в C# настройки
  const savePosition = (x: number, y: number) => {
    try {
      // Обновляем данные в глобальном объекте
      if (window.__SYSTEM_TIME_MOD_DATA__?.settings) {
        window.__SYSTEM_TIME_MOD_DATA__.settings.customPositionX = x
        window.__SYSTEM_TIME_MOD_DATA__.settings.customPositionY = y
        window.__SYSTEM_TIME_MOD_DATA__.settings.useCustomPosition = true
        console.log('Position saved:', { x, y })

        // TODO: Здесь нужно вызвать C# метод для сохранения настроек
        // Это потребует дополнительного биндинга
      }
    } catch (error) {
      console.error('Error saving position:', error)
    }
  }

  // Получаем текущий размер виджета
  const widgetSize = getWidgetSize(settings?.widgetSize ?? 1)

  return (
    <>
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          x: position.x,
          y: position.y
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onMouseEnter={() => !isDragging && setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 999999,
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
        }}
      >
        <motion.div
          animate={{ scale: isExpanded && !isDragging ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            position: 'relative',
            backdropFilter: 'blur(24px)',
            background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(26, 31, 46, 0.6) 100%)',
            border: isDragging ? '1px solid rgba(74, 158, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: widgetSize.borderRadius,
            boxShadow: isDragging ? '0 12px 48px rgba(0, 0, 0, 0.6)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Светящаяся линия сверху */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(74, 158, 255, 0.5) 50%, transparent 100%)',
          }} />

          {/* Иконка перетаскивания */}
          <AnimatePresence>
            {isExpanded && !isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onMouseDown={handleMouseDown}
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  zIndex: 10,
                  transition: 'all 0.2s',
                  cursor: 'grab',
                }}
              >
                <Move size={14} stroke="rgba(255, 255, 255, 0.4)" />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ padding: widgetSize.padding }}>
            {/* Заголовок с временем */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Иконка часов с вращением */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: `${widgetSize.iconWrapperSize}px`,
                  height: `${widgetSize.iconWrapperSize}px`,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.3) 0%, rgba(74, 158, 255, 0.1) 100%)',
                  border: '1px solid rgba(74, 158, 255, 0.3)',
                  color: '#6BB6FF',
                  flexShrink: 0,
                }}
              >
                <Clock size={widgetSize.iconSize * 0.5} stroke="#6BB6FF" />
              </motion.div>

              {/* Цифры времени */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: widgetSize.timeMargin,
                marginRight: widgetSize.timeMargin,
              }}>
                <span style={{
                  color: 'white',
                  fontFamily: "'Consolas', 'Monaco', monospace",
                  fontSize: widgetSize.fontSize,
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}>
                  {time.hours}
                </span>
                <span style={{
                  color: 'rgba(74, 158, 255, 0.6)',
                  fontSize: widgetSize.fontSize,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  marginLeft: widgetSize.dotsMargin,
                  marginRight: widgetSize.dotsMargin,
                }}>
                  :
                </span>
                <span style={{
                  color: 'white',
                  fontFamily: "'Consolas', 'Monaco', monospace",
                  fontSize: widgetSize.fontSize,
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}>
                  {time.minutes}
                </span>
                {(settings?.showSeconds ?? true) && (
                  <span style={{
                    color: 'rgba(74, 158, 255, 0.6)',
                    fontSize: widgetSize.fontSize,
                    fontWeight: 'bold',
                    lineHeight: 1,
                    marginLeft: widgetSize.dotsMargin,
                    marginRight: widgetSize.dotsMargin,
                  }}>
                    :
                  </span>
                )}
                {(settings?.showSeconds ?? true) && (
                  <span style={{
                    color: 'white',
                    fontFamily: "'Consolas', 'Monaco', monospace",
                    fontSize: widgetSize.fontSize,
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}>
                    {time.seconds}
                  </span>
                )}
              </div>

              {/* Индикатор онлайн */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginLeft: '4px' }}
              >
                <div style={{
                  position: 'relative',
                  width: `${widgetSize.dotSize}px`,
                  height: `${widgetSize.dotSize}px`,
                }}>
                  <div style={{
                    width: `${widgetSize.dotSize}px`,
                    height: `${widgetSize.dotSize}px`,
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${widgetSize.dotSize}px`,
                    height: `${widgetSize.dotSize}px`,
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }} />
                </div>
              </motion.div>
            </div>

            {/* Расширенная информация */}
            {(settings?.showDate ?? true) && (
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded && !isDragging ? 'auto' : 0,
                  opacity: isExpanded && !isDragging ? 1 : 0
                }}
                transition={{
                  height: { duration: 0.3, ease: 'easeInOut' },
                  opacity: { duration: 0.2 }
                }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  {/* Дата */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: widgetSize.expandedFontSize,
                  }}>
                    <div style={{
                      color: '#6BB6FF',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Calendar size={16} stroke="#6BB6FF" />
                    </div>
                    <span style={{
                      fontWeight: 500,
                      marginLeft: '12px',
                    }}>
                      {date}
                    </span>
                  </div>

                  {/* Доп. информация */}
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: `calc(${widgetSize.expandedFontSize} * 0.85)`,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}>
                      <div style={{
                        color: '#6BB6FF',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <Wifi size={12} stroke="#6BB6FF" />
                      </div>
                      <span style={{ marginLeft: '8px' }}>
                        {t('widget.systemTime')}
                      </span>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(74, 158, 255, 0.2)',
                      color: '#4A9EFF',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {t('widget.live')}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            filter: 'blur(32px)',
            backgroundColor: 'rgba(74, 158, 255, 0.05)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            filter: 'blur(32px)',
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            pointerEvents: 'none',
          }} />
        </motion.div>

        {/* Подсказка */}
        <AnimatePresence>
          {isExpanded && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '-32px',
                right: 0,
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {t('widget.version', { version: '1.0' })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}