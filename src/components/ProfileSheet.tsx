import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

interface Props {
  open: boolean
  onClose: () => void
  brandRed: string
  brandOrange: string
}

function guessGender(name: string) {
  const last = name.split(' ')[0].slice(-1).toLowerCase()
  return ['а', 'я', 'ь'].includes(last) ? 'female' : 'male'
}

export default function ProfileSheet({ open, onClose, brandRed, brandOrange }: Props) {
  const profile = useAppStore((s) => s.profile)
  if (!profile) return null

  const gender = guessGender(profile.name)
  const avatar = gender === 'female'
    ? 'https://storage.yandexcloud.net/ichiban-photos/female.png'
    : 'https://storage.yandexcloud.net/ichiban-photos/male.png'

  const discountNext =
    profile.total_orders < 5 ? { need: 5 - profile.total_orders, val: 5 } :
    profile.total_orders < 10 ? { need: 10 - profile.total_orders, val: 10 } :
    profile.total_orders < 20 ? { need: 20 - profile.total_orders, val: 15 } :
    null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="profile-sheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
          >
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />
            <div className="profile-avatar">
              <img src={avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div className="profile-name">{profile.name}</div>
            <div className="profile-sub">{profile.phone || 'Телефон не указан'}</div>

            <div className="profile-stat">
              <span>Заказов всего</span>
              <span className="profile-stat-val">{profile.total_orders}</span>
            </div>
            <div className="profile-stat">
              <span>Сумма за этот месяц</span>
              <span className="profile-stat-val">{profile.month_sum.toLocaleString('ru')} ₽</span>
            </div>

            {profile.discount > 0 && (
              <div className="profile-discount">
                <span className="profile-discount-label">Ваша скидка</span>
                <span
                  className="profile-discount-val"
                  style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {profile.discount}%
                </span>
              </div>
            )}

            {discountNext && (
              <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'var(--sub)' }}>
                Ещё {discountNext.need} {discountNext.need === 1 ? 'заказ' : 'заказа'} — и скидка {discountNext.val}% 🎁
              </div>
            )}

            <button onClick={onClose} style={{ width: '100%', marginTop: 20, padding: 13, background: 'var(--card-hover)', border: 'none', borderRadius: 12, color: '#aaa', fontSize: 14, cursor: 'pointer' }}>
              Закрыть
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
