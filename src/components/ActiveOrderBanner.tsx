import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

const STEP_LABELS: Record<number, string> = {
  0: 'Отправлен', 1: 'Принят ✓', 2: 'Готовим', 3: 'В пути', 4: 'Доставлен',
}

interface Props {
  brandRed: string
}

export default function ActiveOrderBanner({ brandRed }: Props) {
  const orderNum = useAppStore((s) => s.orderNum)
  const setOrderNum = useAppStore((s) => s.setOrderNum)
  const [step, setStep] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!orderNum) return
    setStep(0)

    const poll = setInterval(async () => {
      try {
        const r = await fetch(`${API}/order-status/${encodeURIComponent(orderNum)}`)
        const data = await r.json()
        if (data.ok) setStep(data.step)
        if (data.step === 4) clearInterval(poll)
      } catch { /* ignore */ }
    }, 30_000)

    return () => clearInterval(poll)
  }, [orderNum])

  if (!orderNum) return null

  return (
    <AnimatePresence>
      <motion.div
        className="active-order-banner"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="banner-main" onClick={() => setExpanded((e) => !e)}>
          <div>
            <div className="banner-label">Ваш заказ в работе</div>
            <div className="banner-num">{orderNum}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="banner-label">Статус</div>
              <div className="banner-status" style={{ color: brandRed }}>{STEP_LABELS[step]}</div>
            </div>
            <div className="banner-chevron" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>▾</div>
            <button
              className="banner-dismiss"
              onClick={(e) => { e.stopPropagation(); setOrderNum(null) }}
            >✕</button>
          </div>
        </div>

        {/* Шаги */}
        <div className="banner-steps">
          {Object.entries(STEP_LABELS).map(([s, label]) => (
            <div
              key={s}
              className={`order-step${Number(s) < step ? ' done' : ''}${Number(s) === step ? ' active' : ''}`}
              style={Number(s) === step ? { borderColor: brandRed, color: brandRed } : {}}
            >
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
