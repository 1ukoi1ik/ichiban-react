import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { BRANDS } from '../data/brands'
import { API } from '../data/api'

const STEP_LABELS: Record<number, string> = {
  0: 'Отправлен 📨',
  1: 'Принят ✓',
  2: 'Готовим 👨‍🍳',
  3: 'В пути 🛵',
  4: 'Доставлен 🏠',
}

export default function SuccessScreen() {
  const brandKey = useAppStore((s) => s.brandKey)
  const orderNum = useAppStore((s) => s.orderNum)
  const setScreen = useAppStore((s) => s.setScreen)
  const brand = BRANDS[brandKey]
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!orderNum) return
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

  return (
    <div className="screen screen-success">
      <motion.div
        className="success-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.35 }}
      >
        <div className="success-icon" style={{ color: brand.red }}>🎉</div>
        <h2>Заказ принят!</h2>
        {orderNum && <p className="success-num">{orderNum}</p>}
        <p className="success-status">{STEP_LABELS[step]}</p>

        <div className="success-steps">
          {Object.entries(STEP_LABELS).map(([s, label]) => (
            <div
              key={s}
              className={`success-step${Number(s) <= step ? ' done' : ''}${Number(s) === step ? ' current' : ''}`}
              style={Number(s) === step ? { color: brand.red } : {}}
            >
              {label}
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ background: brand.red, marginTop: 24 }}
          onClick={() => setScreen('menu')}
        >
          Вернуться в меню
        </button>
      </motion.div>
    </div>
  )
}
