import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, cartTotal } from '../store/useAppStore'

interface Props {
  open: boolean
  onClose: () => void
  onCheckout: () => void
  brandRed: string
}

export default function CartSheet({ open, onClose, onCheckout, brandRed }: Props) {
  const cart = useAppStore((s) => s.cart)
  const addToCart = useAppStore((s) => s.addToCart)
  const removeFromCart = useAppStore((s) => s.removeFromCart)
  const profile = useAppStore((s) => s.profile)
  const total = cartTotal(cart)
  const discount = profile?.discount ?? 0
  const finalTotal = discount ? Math.round(total * (1 - discount / 100)) : total
  const items = Object.entries(cart).map(([id, item]) => ({ id: Number(id), ...item }))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
          >
            <div className="sheet-handle" />
            <h2 className="sheet-title">Корзина</h2>

            {items.length === 0 ? (
              <p className="sheet-empty">Корзина пуста</p>
            ) : (
              <>
                <div className="sheet-items">
                  {items.map((item) => (
                    <div key={item.id} className="sheet-item">
                      <img src={item.img} alt={item.name} />
                      <div className="sheet-item-info">
                        <span className="sheet-item-name">{item.name}</span>
                        <span className="sheet-item-price">{(item.price * item.qty).toLocaleString()} ₽</span>
                      </div>
                      <div className="qty-ctrl small">
                        <button onClick={() => removeFromCart(item.id)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart(item.id, item.name, item.price, item.img)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {discount > 0 && (
                  <div className="sheet-discount">
                    <span>Скидка {discount}%</span>
                    <span>−{(total - finalTotal).toLocaleString()} ₽</span>
                  </div>
                )}

                <div className="sheet-total">
                  <span>Итого</span>
                  <span>{finalTotal.toLocaleString()} ₽</span>
                </div>

                <button
                  className="btn-primary"
                  style={{ background: brandRed }}
                  onClick={() => { onClose(); onCheckout() }}
                >
                  Оформить заказ
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
