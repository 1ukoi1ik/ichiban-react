import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'
import { BRANDS } from '../data/brands'

const STEP_LABELS: Record<number, string> = {
  0: 'Отправлен 📨', 1: 'Принят ✓', 2: 'Готовим 👨‍🍳', 3: 'В пути 🛵', 4: 'Доставлен 🏠',
}

interface HistoryItem {
  name: string
  qty: number
  price: number
}

interface HistoryOrder {
  num: string
  step: number
  total: number
  items: HistoryItem[]
  date: string
}

interface Props {
  open: boolean
  onClose: () => void
  brandRed: string
  brandOrange: string
}

export default function HistorySheet({ open, onClose, brandRed, brandOrange }: Props) {
  const userId = useAppStore((s) => s.userId)
  const addToCart = useAppStore((s) => s.addToCart)
  const [orders, setOrders] = useState<HistoryOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open || !userId) return
    setLoading(true)
    setError(false)
    fetch(`${API}/orders/history/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.ok ? data.orders : [])
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [open, userId])

  function repeatOrder(items: HistoryItem[]) {
    const allItems = Object.values(BRANDS).flatMap((b) => b.menu)
    items.forEach((item) => {
      const menuItem = allItems.find((m) => m.name === item.name)
      if (!menuItem) return
      for (let i = 0; i < item.qty; i++) {
        addToCart(menuItem.id, menuItem.name, menuItem.price, menuItem.img)
      }
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sheet-header">
            <button className="sheet-back-btn" onClick={onClose}>‹</button>
            <div className="sheet-title">Прошлые заказы</div>
          </div>

          <div className="sheet-body">
            {!userId && (
              <p style={{ color: '#888', textAlign: 'center', padding: '48px 24px', fontSize: 15 }}>
                Войдите через Telegram чтобы видеть историю
              </p>
            )}
            {userId && loading && (
              <p style={{ color: '#888', textAlign: 'center', padding: '48px 24px', fontSize: 15 }}>
                Загружаем...
              </p>
            )}
            {userId && error && (
              <p style={{ color: '#888', textAlign: 'center', padding: '48px 24px', fontSize: 15 }}>
                Ошибка загрузки
              </p>
            )}
            {userId && !loading && !error && orders.length === 0 && (
              <p style={{ color: '#888', textAlign: 'center', padding: '48px 24px', fontSize: 15 }}>
                Заказов пока нет
              </p>
            )}
            {orders.map((o) => (
              <div key={o.num} className="history-order">
                <div className="history-order-header">
                  <span className="history-order-num">{o.num}</span>
                  <span className="history-order-date">{o.date}</span>
                </div>
                {o.items.map((item, i) => (
                  <div key={i} className="history-order-item">
                    <span>{item.name} × {item.qty}</span>
                    <span>{(item.price * item.qty).toLocaleString('ru')} ₽</span>
                  </div>
                ))}
                <div className="history-order-footer">
                  <span className="history-order-step">{STEP_LABELS[o.step] ?? ''}</span>
                  <span className="history-order-total" style={{ color: brandRed }}>
                    {(o.total || 0).toLocaleString('ru')} ₽
                  </span>
                </div>
                {o.items.length > 0 && (
                  <button
                    className="history-repeat-btn"
                    style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})` }}
                    onClick={() => repeatOrder(o.items)}
                  >
                    Повторить заказ
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
