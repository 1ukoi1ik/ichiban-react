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

  const [name, setName] = useState(profile?.name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [address, setAddress] = useState(profile?.address ?? '')
  const [comment, setComment] = useState('')
  const [payment, setPayment] = useState('Наличными курьеру')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
    }
  }, [profile])

  async function placeOrder() {
    if (!name.trim()) { setError('Введите имя'); return }
    if (!address.trim()) { setError('Введите адрес'); return }

    const items = Object.entries(cart).map(([, item]) => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
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
          order_num: orderNum,
          user_id: userId,
        }),
      })
      if (!resp.ok) throw new Error('server')
      setOrderNum(orderNum)
      clearCart()
      setScreen('success')
    } catch {
      setError('Ошибка отправки заказа. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen screen-checkout">
      <div className="checkout-header" style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})` }}>
        <button className="btn-back" onClick={() => setScreen('menu')}>←</button>
        <span>Оформление заказа</span>
      </div>

      <div className="checkout-scroll">
        <motion.div
          className="checkout-form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3>Контакты</h3>
          <input placeholder="Ваше имя *" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />

          <h3>Доставка</h3>
          <input placeholder="Адрес доставки *" value={address} onChange={(e) => setAddress(e.target.value)} />
          <textarea placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />

          <h3>Оплата</h3>
          {['Наличными курьеру', 'Картой курьеру', 'Картой онлайн'].map((p) => (
            <label key={p} className="radio-row">
              <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} />
              {p}
            </label>
          ))}

          <h3>Состав заказа</h3>
          <div className="checkout-items">
            {Object.values(cart).map((item, i) => (
              <div key={i} className="checkout-item">
                <span>{item.name} × {item.qty}</span>
                <span>{(item.price * item.qty).toLocaleString()} ₽</span>
              </div>
            ))}
            {discount > 0 && (
              <div className="checkout-item discount">
                <span>Скидка {discount}%</span>
                <span>−{(total - finalTotal).toLocaleString()} ₽</span>
              </div>
            )}
            <div className="checkout-total">
              <span>Итого</span>
              <span>{finalTotal.toLocaleString()} ₽</span>
            </div>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            className="btn-primary"
            style={{ background: brand.red }}
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? 'Отправляем...' : `Заказать на ${finalTotal.toLocaleString()} ₽`}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
