import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, cartTotal } from '../store/useAppStore'

interface Props {
  open: boolean
  onClose: () => void
  onCheckout: () => void
  brandRed: string
  brandOrange: string
}

export default function CartSheet({ open, onClose, onCheckout, brandRed, brandOrange }: Props) {
  const cart = useAppStore((s) => s.cart)
  const addToCart = useAppStore((s) => s.addToCart)
  const setQty = useAppStore((s) => s.setQty)
  const profile = useAppStore((s) => s.profile)

  const total = cartTotal(cart)
  const discount = profile?.discount ?? 0
  const finalTotal = discount ? Math.round(total * (1 - discount / 100)) : total
  const items = Object.entries(cart).map(([id, item]) => ({ id: Number(id), ...item }))
  const totalCount = items.reduce((s, i) => s + i.qty, 0)

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
          {/* Header */}
          <div className="sheet-header">
            <button className="sheet-back-btn" onClick={onClose}>‹</button>
            <div className="sheet-title">Корзина</div>
            {totalCount > 0 && <span className="sheet-count">{totalCount} позиции</span>}
          </div>

          {/* Body */}
          <div className="sheet-body">
            {items.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '48px 0' }}>Корзина пуста</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.img} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price" style={{ color: brandOrange }}>
                        {(item.price * item.qty).toLocaleString()} ₽
                      </div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => addToCart(item.id, item.name, item.price, item.img)}>+</button>
                    </div>
                  </div>
                ))}

                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Сумма заказа</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                  {discount > 0 && (
                    <div className="cart-summary-row" style={{ color: '#34C759' }}>
                      <span>Скидка {discount}%</span>
                      <span>−{(total - finalTotal).toLocaleString()} ₽</span>
                    </div>
                  )}
                  <div className="cart-summary-divider" />
                  <div className="cart-total-row">
                    <span className="cart-total-label">Итого</span>
                    <span
                      className="cart-total-sum"
                      style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      {finalTotal.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="sheet-footer">
              <button
                className="btn-primary"
                style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})` }}
                onClick={() => { onClose(); onCheckout() }}
              >
                Оформить заказ — {finalTotal.toLocaleString()} ₽
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
