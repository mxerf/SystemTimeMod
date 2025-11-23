import { useEffect, useState } from "react"
import { Clock, Calendar, Wifi, Move } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ModSettings } from '../../hooks/useModSettings'
import { cn } from '../../lib/cn'

// Размеры и классы Tailwind для разных вариантов виджета
const WIDGET_SIZES = {
  small: {
    padding: 'px-4 py-3',
    iconWrapper: 'w-10 h-10',
    iconSize: 18,
    timeFont: 'text-[20px]',
    timeGap: 'gap-0.5',
    dotsMargin: 'mx-1',
    dotSize: 'w-2.5 h-2.5',
    expandedFont: 'text-xs',
    cardRadius: 'rounded-2xl',
  },
  medium: {
    padding: 'px-6 py-4',
    iconWrapper: 'w-12 h-12',
    iconSize: 22,
    timeFont: 'text-[28px]',
    timeGap: 'gap-0.5',
    dotsMargin: 'mx-1.5',
    dotSize: 'w-3 h-3',
    expandedFont: 'text-sm',
    cardRadius: 'rounded-3xl',
  },
  large: {
    padding: 'px-8 py-5',
    iconWrapper: 'w-14 h-14',
    iconSize: 26,
    timeFont: 'text-[36px]',
    timeGap: 'gap-1',
    dotsMargin: 'mx-2',
    dotSize: 'w-3.5 h-3.5',
    expandedFont: 'text-base',
    cardRadius: 'rounded-[28px]',
  },
} as const

type WidgetSizeName = keyof typeof WIDGET_SIZES
type WidgetSizeConfig = typeof WIDGET_SIZES[WidgetSizeName]

const SIZE_ORDER: WidgetSizeName[] = ['small', 'medium', 'large']

function getWidgetSize(sizeIndex: number): WidgetSizeConfig {
  const sizeName = SIZE_ORDER[sizeIndex]
  return WIDGET_SIZES[sizeName] ?? WIDGET_SIZES.medium
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
      const locale = settings?.language || 'en-US'
      const dateString = formatDate(now, locale === 'ru' ? "ru-RU" : 'en-US')

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
  const savePosition = async (x: number, y: number) => {
    try {
      // Вызываем C# CallBinding для сохранения позиции
      const engine = (window as any).engine
      if (engine && engine.call) {
        await engine.call('SystemTimeMod.SaveWidgetPosition', JSON.stringify({ x, y }))
        console.log('SystemTimeMod: Position saved:', { x, y })
      }
    } catch (error) {
      console.error('SystemTimeMod: Error saving position:', error)
    }
  }

  // Получаем текущий размер виджета
  const widgetSize = getWidgetSize(settings?.widgetSize ?? 1)

  return (
    <div
      className="pointer-events-none"
      onMouseEnter={() => !isDragging && setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 999999,
      }}
    >
      <div className="pointer-events-auto">
        <div
          className={cn(
            'relative flex transform-gpu flex-col overflow-hidden border bg-gradient-to-br from-slate-900/80 to-slate-900/60 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out backdrop-blur-3xl',
            widgetSize.cardRadius,
            isExpanded && !isDragging && 'scale-[1.01]',
            isDragging
              ? 'border-cyan-400/60 shadow-[0_12px_48px_rgba(0,0,0,0.6)]'
              : 'border-white/20'
          )}
        >
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

          <button
            type="button"
            onMouseDown={handleMouseDown}
            className={cn(
              'absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-white/60 transition-opacity duration-200 cursor-grab',
              isExpanded && !isDragging ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            <Move size={14} stroke="currentColor" />
          </button>

          <div className={cn('flex flex-col', widgetSize.padding)}>
            <div className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border border-sky-400/30 bg-gradient-to-b from-sky-500/20 to-transparent text-sky-300 transition-transform duration-300',
                  widgetSize.iconWrapper,
                  isExpanded && 'rotate-180'
                )}
              >
                <Clock size={widgetSize.iconSize} stroke="#6BB6FF" />
              </div>

              <div className={cn('ml-4 mr-4 flex items-baseline font-[\'Consolas\'] font-bold text-white', widgetSize.timeGap)}>
                <span className={widgetSize.timeFont}>{time.hours}</span>
                <span className={cn('text-sky-300', widgetSize.timeFont, widgetSize.dotsMargin)}>:</span>
                <span className={widgetSize.timeFont}>{time.minutes}</span>
                {(settings?.showSeconds ?? true) && (
                  <span className={cn('text-sky-300', widgetSize.timeFont, widgetSize.dotsMargin)}>:</span>
                )}
                {(settings?.showSeconds ?? true) && <span className={widgetSize.timeFont}>{time.seconds}</span>}
              </div>

              <div className="relative ml-2">
                <div className={cn('rounded-full bg-emerald-400', widgetSize.dotSize)} />
                <div className={cn('absolute inset-0 rounded-full bg-emerald-400 opacity-60 animate-ping', widgetSize.dotSize)} />
              </div>
            </div>

            {(settings?.showDate ?? true) && (
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-out',
                  isExpanded && !isDragging ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className={cn('flex items-center text-white/70', widgetSize.expandedFont)}>
                    <span className="text-sky-300">
                      <Calendar size={16} stroke="#6BB6FF" />
                    </span>
                    <span className="ml-3 font-medium">{date}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-white/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-300">
                        <Wifi size={12} stroke="#6BB6FF" />
                      </span>
                      <span>{t('widget.systemTime')}</span>
                    </div>
                    <span className="rounded-md bg-sky-400/20 px-2 py-1 text-[11px] font-semibold text-sky-300">
                      {t('widget.live')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pointer-events-none">
            <span className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
            <span className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-purple-400/10 blur-3xl" />
          </div>

          <div
            className={cn(
              'absolute -bottom-8 right-0 text-xs font-medium text-white/40 transition-opacity duration-200',
              isExpanded && !isDragging ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t('widget.version', { version: '1.0' })}
          </div>
        </div>
      </div>
    </div>
  )
}