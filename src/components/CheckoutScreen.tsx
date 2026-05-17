import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, cartTotal } from '../store/useAppStore'
import { BRANDS } from '../data/brands'
import { API, genOrderNum } from '../data/api'

const DADATA_KEY = import.meta.env.VITE_DADATA_KEY as string

export default function CheckoutScreen() {
  const brandKey = useAppStore((s) => s.brandKey)
  const cart = useAppStore((s) => s.cart)
  const profile = useAppStore((s) => s.profile)
  const userId = useAppStore((s) => s.userId)
  const setScreen = useAppStore((s) => s.setScreen)
  const setOrderNum = useAppStore((s) => s.setOrderNum)
  const setLastOrderItems = useAppStore((s) => s.setLastOrderItems)
  const clearCart = useAppStore((s) => s.clearCart)

  const brand = BRANDS[brandKey]
  const total = cartTotal(cart)
  const discount = profile?.discount ?? 0
  const finalTotal = discount ? Math.round(total * (1 - discount / 100)) : total

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addrOpen, setAddrOpen] = useState(false)
  const [dadataSuggestions, setDadataSuggestions] = useState<string[]>([])
  const dadataTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [comment, setComment] = useState('')
  const [payment, setPayment] = useState('Наличными курьеру')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name)
      if (profile.phone) setPhone(profile.phone)
      const lastAddr = profile.addresses?.[0] ?? profile.address ?? ''
      if (lastAddr) setAddress(lastAddr)
    }
  }, [profile])

  const fetchDadata = useCallback((q: string) => {
    if (dadataTimer.current) clearTimeout(dadataTimer.current)
    if (q.length < 3) { setDadataSuggestions([]); return }
    dadataTimer.current = setTimeout(async () => {
      try {
        const r = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${DADATA_KEY}` },
          body: JSON.stringify({ query: q, count: 5, restrict_value: true, locations: [{ city: 'Луганск' }, { city: 'Луганск', country_iso_code: 'RU' }] }),
        })
        const data = await r.json()
        setDadataSuggestions((data.suggestions ?? []).map((s: any) => s.value as string))
      } catch { /* ignore */ }
    }, 300)
  }, [])

  function saveAddress(addr: string) {
    if (!userId || !addr.trim()) return
    fetch(`${API}/profile/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, address: addr.trim() }),
    }).catch(() => {})
  }

  async function placeOrder() {
    if (!name.trim()) { setError('Введите имя'); return }
    if (!address.trim()) { setError('Введите адрес доставки'); return }

    const items = Object.values(cart).map((item) => ({
      name: item.name, qty: item.qty, price: item.price,
    }))
    if (!items.length) { setError('Корзина пуста'); return }

    const orderNum = genOrderNum()
    setLoading(true)
    setError('')

    try {
      const resp = await fetch(`${API}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, address, comment, payment,
          items, total: finalTotal, discount,
          order_num: orderNum, user_id: userId,
        }),
      })
      if (!resp.ok) throw new Error('server')
      saveAddress(address)
      setLastOrderItems(items)
      setOrderNum(orderNum)
      clearCart()
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success')
      setScreen('success')
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen-checkout">
      <div className="page-header">
        <button className="back-btn" onClick={() => setScreen('menu')}>‹</button>
        <div className="page-title">Оформление заказа</div>
      </div>

      <div className="form-scroll">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Ваше имя</label>
              <input className="form-input" placeholder="Иван Иванов" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Номер телефона</label>
              <input className="form-input" type="tel" placeholder="+7 (000) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Адрес доставки</label>
              <input
                className="form-input"
                placeholder="Улица, дом, квартира"
                value={address}
                onChange={(e) => { setAddress(e.target.value); fetchDadata(e.target.value) }}
                onFocus={() => setAddrOpen(true)}
                onBlur={() => setTimeout(() => setAddrOpen(false), 200)}
              />
              {addrOpen && (() => {
                const saved = profile?.addresses ?? []
                const suggestions = dadataSuggestions.filter(s => !saved.includes(s))
                const all = [...saved, ...suggestions]
                return all.length > 0 ? (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 10, marginTop: 4, overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}>
                    {saved.map((addr) => (
                      <div
                        key={addr}
                        onMouseDown={() => { setAddress(addr); setAddrOpen(false); setDadataSuggestions([]) }}
                        style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={{ color: 'var(--sub)' }}>🕐</span> {addr}
                      </div>
                    ))}
                    {suggestions.map((addr) => (
                      <div
                        key={addr}
                        onMouseDown={() => { setAddress(addr); setAddrOpen(false); setDadataSuggestions([]) }}
                        style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={{ color: 'var(--sub)' }}>📍</span> {addr}
                      </div>
                    ))}
                  </div>
                ) : null
              })()}
            </div>
            <div className="form-group">
              <label className="form-label">Комментарий</label>
              <textarea className="form-input form-textarea" rows={2} placeholder="Код домофона, этаж, пожелания..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Способ оплаты</label>
              <div className="pay-options">
                {[
                  { key: 'Картой курьеру', icon: '💳', label: 'Картой курьеру' },
                  { key: 'Наличными курьеру', icon: '💵', label: 'Наличными' },
                  { key: 'Telegram Pay', icon: '✈️', label: 'Telegram Pay' },
                ].map(({ key, icon, label }) => (
                  <div
                    key={key}
                    className={`pay-opt${payment === key ? ' active' : ''}`}
                    onClick={() => {
                      setPayment(key)
                      window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.()
                    }}
                  >
                    <span className="pay-icon">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ваш заказ</label>
              <div className="order-summary">
                {Object.values(cart).map((item, i) => (
                  <div key={i} className="order-summary-item">
                    <span>{item.name} × {item.qty}</span>
                    <span>{(item.price * item.qty).toLocaleString()} ₽</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="order-summary-item" style={{ color: '#34C759' }}>
                    <span>Скидка {discount}%</span>
                    <span>−{(total - finalTotal).toLocaleString()} ₽</span>
                  </div>
                )}
              </div>
              <div className="order-total-row">
                <span>Итого</span>
                <span
                  style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {finalTotal.toLocaleString()} ₽
                </span>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}
          </div>
        </motion.div>
      </div>

      <div className="checkout-footer">
        <button
          className="btn-primary"
          style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})` }}
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? 'Отправляем...' : `Заказать — ${finalTotal.toLocaleString()} ₽`}
        </button>
      </div>
    </div>
  )
}
