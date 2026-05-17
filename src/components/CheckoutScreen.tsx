import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, cartTotal } from '../store/useAppStore'
import { BRANDS } from '../data/brands'
import { API, genOrderNum } from '../data/api'


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
  const [phone, setPhone] = useState('+7')
  const [phoneError, setPhoneError] = useState('')
  const [street, setStreet] = useState('')
  const [house, setHouse] = useState('')
  const [flat, setFlat] = useState('')
  const [entrance, setEntrance] = useState('')
  const [streetOpen, setStreetOpen] = useState(false)
  const [dadataSuggestions, setDadataSuggestions] = useState<string[]>([])
  const dadataTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [comment, setComment] = useState('')
  const [payment, setPayment] = useState('Наличными курьеру')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [addrPopupOpen, setAddrPopupOpen] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const streetRef = useRef<HTMLInputElement>(null)
  const houseRef = useRef<HTMLInputElement>(null)

  function focusField(ref: React.RefObject<HTMLInputElement | null>, field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: true }))
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => ref.current?.focus(), 300)
  }

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name)
      if (profile.phone) setPhone(profile.phone || '+7')
      const lastAddr = profile.addresses?.[0] ?? profile.address ?? ''
      if (lastAddr) {
        const parts = lastAddr.split(',').map((s: string) => s.trim())
        const streetPart = parts.find((p: string) => !p.match(/^д\s/i) && !p.match(/^кв\s/i) && !p.match(/^подъезд\s/i)) ?? ''
        const housePart = (parts.find((p: string) => p.match(/^д\s/i)) ?? '').replace(/^д\s+/i, '')
        const flatPart = (parts.find((p: string) => p.match(/^кв\s/i)) ?? '').replace(/^кв\s+/i, '')
        const entrancePart = (parts.find((p: string) => p.match(/^подъезд\s/i)) ?? '').replace(/^подъезд\s+/i, '')
        setStreet(streetPart)
        if (housePart) setHouse(housePart)
        if (flatPart) setFlat(flatPart)
        if (entrancePart) setEntrance(entrancePart)
      }
    }
  }, [profile])

  function formatPhone(digits: string) {
    let f = '+7'
    if (digits.length > 0) f += ' (' + digits.slice(0, 3)
    if (digits.length >= 3) f += ') ' + digits.slice(3, 6)
    if (digits.length >= 6) f += '-' + digits.slice(6, 8)
    if (digits.length >= 8) f += '-' + digits.slice(8, 10)
    return f
  }

  function handlePhone(raw: string) {
    const digits = raw.replace(/\D/g, '').replace(/^7/, '').slice(0, 10)
    setPhone(formatPhone(digits))
    setFieldErrors(p => ({ ...p, phone: false }))
    setPhoneError(digits.length > 0 && digits.length < 10 ? 'Введите полный номер' : '')
  }

  const fetchDadata = useCallback((q: string) => {
    if (dadataTimer.current) clearTimeout(dadataTimer.current)
    if (q.length < 3) { setDadataSuggestions([]); return }
    dadataTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`${API}/suggest/address?q=${encodeURIComponent(q)}`)
        const data = await r.json()
        setDadataSuggestions((data.suggestions ?? []) as string[])
      } catch { /* ignore */ }
    }, 300)
  }, [])

  function saveAddress(addr: string) {
    const uid = userId ?? window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? null
    if (!uid || !addr.trim()) return
    fetch(`${API}/profile/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: uid, address: addr.trim() }),
    }).catch(() => {})
  }

  function saveProfile(n: string, p: string) {
    if (!userId) return
    fetch(`${API}/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, name: n.trim(), phone: p.trim() }),
    }).catch(() => {})
  }

  function saveProfileNameOnly(n: string) {
    if (!userId) return
    fetch(`${API}/profile/update-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, name: n.trim(), phone: '' }),
    }).catch(() => {})
  }

  function requestTgContact() {
    const tg = window.Telegram?.WebApp
    if (!tg) return
    const _tg = tg
    function onContact(data: any) {
      _tg.offEvent('contactRequested', onContact)
      if (data?.status !== 'sent') return
      const contact = data?.responseUnsafe?.contact ?? data?.contact
      if (contact?.phone_number) {
        const raw = contact.phone_number.startsWith('+') ? contact.phone_number : `+${contact.phone_number}`
        handlePhone(raw)
        const n = contact?.first_name && !name.trim() ? contact.first_name : name
        if (contact?.first_name && !name.trim()) setName(contact.first_name)
        saveProfile(n, raw)
      }
    }
    tg.onEvent('contactRequested', onContact)
    tg.requestContact()
  }

  async function placeOrder() {
    if (!name.trim()) { focusField(nameRef, 'name'); return }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 11) { focusField(phoneRef, 'phone'); return }
    if (!street.trim()) { focusField(streetRef, 'street'); return }
    if (!house.trim()) { focusField(houseRef, 'house'); return }
    setFieldErrors({})
    const address = [street.trim(), `д ${house.trim()}`, flat.trim() ? `кв ${flat.trim()}` : '', entrance.trim() ? `подъезд ${entrance.trim()}` : ''].filter(Boolean).join(', ')

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
      saveProfileNameOnly(name)
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
              <input ref={nameRef} className="form-input" placeholder="Иван Иванов" value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: false })) }}
                style={fieldErrors.name ? { borderColor: 'var(--red)' } : {}} />
              {fieldErrors.name && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>Введите имя</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Номер телефона</label>
              <input
                ref={phoneRef}
                className="form-input"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => handlePhone(e.target.value)}
                style={phoneError || fieldErrors.phone ? { borderColor: 'var(--red)' } : {}}
              />
              {(phoneError || fieldErrors.phone) && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{phoneError || 'Введите корректный номер'}</div>}
              <button type="button" onClick={requestTgContact}
                style={{ marginTop: 8, width: '100%', padding: '9px 14px', background: 'var(--card-hover)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                📱 Поделиться номером из Telegram
              </button>
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Улица <span style={{ color: 'var(--red)' }}>*</span></label>
              <input
                ref={streetRef}
                className="form-input"
                placeholder="ул Советская"
                value={street}
                onChange={(e) => { setStreet(e.target.value); fetchDadata(e.target.value); setFieldErrors(p => ({ ...p, street: false })) }}
                onFocus={() => setStreetOpen(true)}
                onBlur={() => setTimeout(() => setStreetOpen(false), 200)}
                style={fieldErrors.street ? { borderColor: 'var(--red)' } : {}}
              />
              {fieldErrors.street && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>Введите улицу</div>}
              {streetOpen && (() => {
                const saved = profile?.addresses ?? []
                const suggestions = dadataSuggestions.filter(s => !saved.includes(s))
                const all = [...saved, ...suggestions]
                return all.length > 0 ? (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginTop: 4, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                    {saved.map((addr) => (
                      <div key={addr} onMouseDown={() => { setStreet(addr); setStreetOpen(false); setDadataSuggestions([]) }}
                        style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--sub)' }}>🕐</span> {addr}
                      </div>
                    ))}
                    {suggestions.map((addr) => (
                      <div key={addr} onMouseDown={() => { setStreet(addr); setStreetOpen(false); setDadataSuggestions([]) }}
                        style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--sub)' }}>📍</span> {addr}
                      </div>
                    ))}
                  </div>
                ) : null
              })()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div className="form-group">
                <label className="form-label">Дом <span style={{ color: 'var(--red)' }}>*</span></label>
                <input ref={houseRef} className="form-input" placeholder="5" value={house}
                  onChange={(e) => { setHouse(e.target.value); setFieldErrors(p => ({ ...p, house: false })) }}
                  style={fieldErrors.house ? { borderColor: 'var(--red)' } : {}} />
                {fieldErrors.house && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>Введите дом</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Квартира</label>
                <input className="form-input" placeholder="12" value={flat} onChange={(e) => setFlat(e.target.value)} inputMode="numeric" />
              </div>
              <div className="form-group">
                <label className="form-label">Подъезд</label>
                <input className="form-input" placeholder="2" value={entrance} onChange={(e) => setEntrance(e.target.value)} inputMode="numeric" />
              </div>
            </div>
            {profile?.addresses && profile.addresses.length > 0 && (
              <div className="form-group">
                <button type="button" onClick={() => setAddrPopupOpen(true)}
                  style={{ width: '100%', padding: '9px 14px', background: 'var(--card-hover)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  📍 Ваши адреса
                </button>
              </div>
            )}
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

      {addrPopupOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setAddrPopupOpen(false)}>
          <div style={{ width: 'min(360px, calc(100vw - 32px))', background: 'var(--card)', borderRadius: 20, padding: '20px', maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Ваши адреса</div>
            {(profile?.addresses ?? []).map((addr) => (
              <div key={addr}
                onClick={() => {
                  // парсим "ул Советская, д 5, кв 12, подъезд 2"
                  const parts = addr.split(',').map(s => s.trim())
                  const streetPart = parts.find(p => !p.match(/^д\s/i) && !p.match(/^кв\s/i) && !p.match(/^подъезд\s/i)) ?? ''
                  const housePart = (parts.find(p => p.match(/^д\s/i)) ?? '').replace(/^д\s+/i, '')
                  const flatPart = (parts.find(p => p.match(/^кв\s/i)) ?? '').replace(/^кв\s+/i, '')
                  const entrancePart = (parts.find(p => p.match(/^подъезд\s/i)) ?? '').replace(/^подъезд\s+/i, '')
                  setStreet(streetPart)
                  setHouse(housePart)
                  setFlat(flatPart)
                  setEntrance(entrancePart)
                  setAddrPopupOpen(false)
                }}
                style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--sub)', fontSize: 16 }}>📍</span> {addr}
              </div>
            ))}
            <button onClick={() => setAddrPopupOpen(false)}
              style={{ width: '100%', marginTop: 16, padding: 12, background: 'var(--card-hover)', border: 'none', borderRadius: 12, color: '#666', fontSize: 14, cursor: 'pointer' }}>
              Закрыть
            </button>
          </div>
        </div>
      )}

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
