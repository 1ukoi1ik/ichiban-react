import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

const STEP_LABELS: Record<number, string> = {
  0: 'Отправлен', 1: 'Принят ✓', 2: 'Готовим 👨‍🍳', 3: 'В пути 🛵', 4: 'Доставлен 🏠',
}

interface Props {
  brandRed: string
  brandOrange: string
}

export default function ActiveOrderBanner({ brandRed, brandOrange }: Props) {
  const orderNum = useAppStore((s) => s.orderNum)
  const setOrderNum = useAppStore((s) => s.setOrderNum)
  const lastOrderItems = useAppStore((s) => s.lastOrderItems)
  const [step, setStep] = useState(0)
  const [popupOpen, setPopupOpen] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!orderNum) return
    setStep(0)

    async function fetchStep() {
      try {
        const r = await fetch(`${API}/order-status/${encodeURIComponent(orderNum!)}`)
        const data = await r.json()
        if (data.ok) {
          setStep(data.step)
          if (data.step === 4 && pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
          }
        }
      } catch { /* ignore */ }
    }

    fetchStep()
    pollRef.current = setInterval(fetchStep, 30_000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [orderNum])

  if (!orderNum) return null

  const delivered = step === 4
  const total = lastOrderItems.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="active-order-banner"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setPopupOpen(true)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'stretch', gap: 0, padding: 0, overflow: 'hidden' }}
        >
          {/* Основная часть */}
          <div style={{ flex: 1, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="banner-label">Ваш заказ</div>
              <div className="banner-num">{orderNum}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="banner-label">Статус</div>
              <div className="banner-status" style={{ color: brandRed }}>{STEP_LABELS[step]}</div>
            </div>
          </div>

          {/* Крестик — только после доставки */}
          {delivered && (
            <button
              onClick={(e) => { e.stopPropagation(); setOrderNum(null) }}
              style={{
                width: 52, background: brandRed, border: 'none',
                color: '#fff', fontSize: 20, cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Попап с деталями заказа */}
      <AnimatePresence>
        {popupOpen && (
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPopupOpen(false)}
          >
            <motion.div
              style={{ width: 'min(360px, calc(100vw - 32px))', background: 'var(--card)', borderRadius: 20, padding: '24px 20px 20px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Заказ {orderNum}</div>
              <div style={{ fontSize: 13, color: brandRed, fontWeight: 600, marginBottom: 16 }}>{STEP_LABELS[step]}</div>

              {/* Прогресс-шаги */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
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

              {/* Состав */}
              {lastOrderItems.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Состав заказа</div>
                  {lastOrderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)' }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ color: brandOrange }}>{(item.price * item.qty).toLocaleString()} ₽</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    <span>Итого</span>
                    <span style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {total.toLocaleString()} ₽
                    </span>
                  </div>
                </>
              )}

              <button
                onClick={() => setPopupOpen(false)}
                style={{ width: '100%', marginTop: 16, padding: 13, background: 'var(--card-hover)', border: 'none', borderRadius: 12, color: '#666', fontSize: 14, cursor: 'pointer' }}
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
