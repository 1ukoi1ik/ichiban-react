import { useState, useEffect } from 'react'
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
  const clearCart = useAppStore((s) => s.clearCart)

  const brand = BRANDS[brandKey]
  const total = cartTotal(cart)
  const discount = profile?.discount ?? 0
  const finalTotal = discount ? Math.round(total * (1 - discount / 100)) : total

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [payment, setPayment] = useState('Наличными курьеру')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name)
      if (profile.phone) setPhone(profile.phone)
      if (profile.address) setAddress(profile.address)
    }
  }, [profile])

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
      setOrderNum(orderNum)
      clearCart()
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
            <div className="form-group">
              <label className="form-label">Адрес доставки</label>
              <input className="form-input" placeholder="Улица, дом, квартира" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Комментарий</label>
              <textarea className="form-input form-textarea" rows={2} placeholder="Код домофона, этаж, пожелания..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Оплата</label>
              <div className="radio-group">
                {['Наличными курьеру', 'Картой курьеру', 'Картой онлайн'].map((p) => (
                  <label key={p} className="radio-row">
                    <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} />
                    {p}
                  </label>
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
