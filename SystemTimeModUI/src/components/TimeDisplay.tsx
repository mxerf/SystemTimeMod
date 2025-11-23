import { useEffect, useState } from "react"
import { Clock, Calendar, Wifi, Move } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import engine from 'cohtml/cohtml'
import { useGameLanguage, type ModSettings } from '../hooks/useModSettings'

// Размеры для разных вариантов виджета
const WIDGET_SIZES = {
  small: {
    padding: 12,
    iconSize: 40,
    iconInnerSize: 18,
    timeFont: 20,
    dotSize: 10,
    expandedFont: 12,
    borderRadius: 16,
    dotsMargin: 0
  },
  medium: {
    padding: 16,
    iconSize: 48,
    iconInnerSize: 22,
    timeFont: 28,
    dotSize: 12,
    expandedFont: 14,
    borderRadius: 24,
    dotsMargin: 0
  },
  large: {
    padding: 20,
    iconSize: 56,
    iconInnerSize: 26,
    timeFont: 36,
    dotSize: 14,
    expandedFont: 16,
    borderRadius: 28,
    dotsMargin: 1
  },
} as const

type WidgetSizeName = keyof typeof WIDGET_SIZES
const SIZE_ORDER: WidgetSizeName[] = ['small', 'medium', 'large']

function getWidgetSize(sizeIndex: number) {
  const sizeName = SIZE_ORDER[sizeIndex]
  return WIDGET_SIZES[sizeName] ?? WIDGET_SIZES.medium
}

// Функция для форматирования даты
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
  settings: ModSettings
}

export const TimeDisplay = ({ settings }: TimeDisplayProps) => {
  const { t } = useTranslation()
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' })
  const [date, setDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const language = useGameLanguage()

  const widgetSize = getWidgetSize(settings?.widgetSize ?? 1)

  useEffect(() => {
    console.log('SystemTimeMod: TimeDisplay mounted!')
  }, [])

  // Используем сохранённую позицию
  useEffect(() => {
    if (settings?.useCustomPosition) {
      setPosition({ x: settings.customPositionX, y: settings.customPositionY })
    }
  }, [settings])

  // Обновление времени
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      const use24Hour = settings?.use24HourFormat ?? true
      let hoursStr: string
      if (!use24Hour) {
        hours = hours % 12 || 12
        hoursStr = String(hours).padStart(2, '0')
      } else {
        hoursStr = String(hours).padStart(2, '0')
      }

      const locale = language || 'en-US'
      const dateString = formatDate(now, locale ?? 'en-US')

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

    const handleMouseUp = async () => {
      if (isDragging) {
        setIsDragging(false)
        try {
          await engine.call('SystemTimeMod.SaveWidgetPosition', JSON.stringify({
            x: position.x,
            y: position.y
          }))
          console.log('SystemTimeMod: Position saved:', position)
        } catch (error) {
          console.error('SystemTimeMod: Error saving position:', error)
        }
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

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 999999,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseEnter={() => !isDragging && setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: `${widgetSize.borderRadius}px`,
          border: isDragging ? '1px solid rgba(103, 232, 249, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)',
          color: 'white',
          boxShadow: isDragging
            ? '0 12px 48px rgba(0, 0, 0, 0.6)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease-out',
          transform: isExpanded && !isDragging ? 'scale(1.01)' : 'scale(1)',
          backdropFilter: 'blur(48px)',
          WebkitBackdropFilter: 'blur(48px)',
          padding: `${widgetSize.padding}px`
        }}>
          {/* Top gradient line */}
          <span style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)'
          }} />

          {/* Drag button */}
          <button
            type="button"
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              left: '8px',
              top: '8px',
              zIndex: 10,
              display: 'flex',
              height: '24px',
              width: '24px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: 'opacity 0.2s',
              opacity: isExpanded && !isDragging ? 1 : 0,
              pointerEvents: isExpanded && !isDragging ? 'auto' : 'none'
            }}
          >
            <Move size={14} color="white" />
          </button>

          {/* Time row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${widgetSize.iconSize}px`,
              height: `${widgetSize.iconSize}px`,
              borderRadius: '50%',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.2) 0%, transparent 100%)',
              color: 'rgb(125, 211, 252)',
              transition: 'transform 0.3s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              <Clock size={widgetSize.iconInnerSize} stroke="#6BB6FF" />
            </div>

            {/* Time */}
            <div style={{
              marginLeft: '16px',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'monospace',
              fontWeight: '800',
              fontSize: `${widgetSize.timeFont}px`,
            }}>
              <span style={{ fontWeight: 'bold' }}>{time.hours}</span>
              <span style={{
                color: 'rgb(125, 211, 252)',
                marginRight: widgetSize.dotsMargin,
                marginLeft: widgetSize.dotsMargin,
                fontWeight: 'bold'
              }}>:</span>
              <span style={{ fontWeight: '800' }}>{time.minutes}</span>
              {(settings?.showSeconds ?? true) && (
                <>
                  <span style={{
                    color: 'rgb(125, 211, 252)',
                    marginRight: widgetSize.dotsMargin,
                    marginLeft: widgetSize.dotsMargin,
                    fontWeight: '800'
                  }}>:</span>
                  <span style={{ fontWeight: '800' }}>{time.seconds}</span>
                </>
              )}
            </div>

            {/* Status dot with ping animation */}
            <div style={{
              position: 'relative',
              marginLeft: '8px',
              width: `${widgetSize.dotSize}px`,
              height: `${widgetSize.dotSize}px`
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgb(52, 211, 153)'
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgb(52, 211, 153)',
                opacity: 0.6,
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
            </div>
          </div>

          {/* Expanded content */}
          {(settings?.showDate ?? true) && (
            <div style={{
              maxHeight: isExpanded && !isDragging ? '192px' : '0',
              opacity: isExpanded && !isDragging ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease-out'
            }}>
              <div style={{
                marginTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: `${widgetSize.expandedFont}px`
                }}>
                  <span style={{ color: 'rgb(125, 211, 252)' }}>
                    <Calendar size={16} stroke="#6BB6FF" />
                  </span>
                  <span style={{ marginLeft: '12px', fontWeight: 500 }}>{date}</span>
                </div>

                {/* <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'rgb(125, 211, 252)' }}>
                      <Wifi size={12} stroke="#6BB6FF" />
                    </span>
                    <span style={{ marginLeft: "8px" }}>{t('widget.systemTime')}</span>
                  </div>
                  <span style={{
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgb(125, 211, 252)'
                  }}>
                    {t('widget.live')}
                  </span>
                </div> */}
              </div>
            </div>
          )}

          {/* Decorative blurs */}
          <div style={{ pointerEvents: 'none' }}>
            <span style={{
              position: 'absolute',
              bottom: '-16px',
              right: '-16px',
              height: '96px',
              width: '96px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              filter: 'blur(48px)',
            }} />
            <span style={{
              position: 'absolute',
              left: '-16px',
              top: '-16px',
              height: '64px',
              width: '64px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.1)',
              filter: 'blur(48px)',
            }} />
          </div>

          {/* Version */}
          <div style={{
            position: 'absolute',
            bottom: '-32px',
            right: 0,
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.4)',
            transition: 'opacity 0.2s',
            opacity: isExpanded && !isDragging ? 1 : 0
          }}>
            {t('widget.version', { version: '1.0' })}
          </div>
        </div>
      </div>

      {/* Keyframes for ping animation */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}