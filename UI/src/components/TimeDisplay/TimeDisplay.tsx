import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Calendar, Wifi, Move } from 'lucide-react'

export const TimeDisplay = () => {
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' })
  const [date, setDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      
      const dateString = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      
      setTime({ hours, minutes, seconds })
      setDate(dateString)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])
  
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
            borderRadius: '16px',
            boxShadow: isDragging ? '0 12px 48px rgba(0, 0, 0, 0.6)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
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
          
          <div style={{ padding: '16px 24px' }}>
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
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.3) 0%, rgba(74, 158, 255, 0.1) 100%)',
                  border: '1px solid rgba(74, 158, 255, 0.3)',
                  color: '#6BB6FF',
                  flexShrink: 0,
                }}
              >
                <Clock size={20} stroke="#6BB6FF" />
              </motion.div>

              {/* Цифры времени */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginLeft: '16px',
                marginRight: '16px',
              }}>
                <span style={{
                  color: 'white',
                  fontFamily: "'Consolas', 'Monaco', monospace",
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}>
                  {time.hours}
                </span>
                <span style={{
                  color: 'rgba(74, 158, 255, 0.6)',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  marginLeft: '4px',
                  marginRight: '4px',
                }}>
                  :
                </span>
                <span style={{
                  color: 'white',
                  fontFamily: "'Consolas', 'Monaco', monospace",
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}>
                  {time.minutes}
                </span>
                <span style={{
                  color: 'rgba(74, 158, 255, 0.6)',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  marginLeft: '4px',
                  marginRight: '4px',
                }}>
                  :
                </span>
                <span style={{
                  color: 'white',
                  fontFamily: "'Consolas', 'Monaco', monospace",
                  fontSize: '28px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}>
                  {time.seconds}
                </span>
              </div>

              {/* Индикатор онлайн */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginLeft: '4px' }}
              >
                <div style={{
                  position: 'relative',
                  width: '8px',
                  height: '8px',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }} />
                </div>
              </motion.div>
            </div>

            {/* Расширенная информация */}
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
                  fontSize: '14px',
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
                  fontSize: '12px',
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
                      Системное время
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
                    LIVE
                  </div>
                </div>
              </div>
            </motion.div>
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
              SystemTimeMod v1.0
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}