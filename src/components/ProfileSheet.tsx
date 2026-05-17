import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

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

function requestPhone(userId: number | null, setProfile: (p: any) => void) {
  const tg = window.Telegram?.WebApp
  if (!tg) return
  tg.requestContact((ok: boolean, contact: any) => {
    if (!ok || !contact?.contact) return
    const { phone_number, first_name, last_name } = contact.contact
    const name = [first_name, last_name].filter(Boolean).join(' ')
    setProfile({
      ok: true,
      new_client: true,
      name: name || first_name || '',
      phone: phone_number || '',
      address: '',
      total_orders: 0,
      month_sum: 0,
      discount: 0,
    })
    // сохраняем телефон на сервере если есть userId
    if (userId && phone_number) {
      fetch(`${API}/profile/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, phone: phone_number, name }),
      }).catch(() => {})
    }
  })
}

export default function ProfileSheet({ open, onClose, brandRed, brandOrange }: Props) {
  const profile = useAppStore((s) => s.profile)
  const userId = useAppStore((s) => s.userId)
  const setProfile = useAppStore((s) => s.setProfile)
  const isNew = !profile || profile.new_client

  const gender = profile ? guessGender(profile.name) : 'male'
  const avatar = gender === 'female'
    ? 'https://storage.yandexcloud.net/ichiban-photos/female.png'
    : 'https://storage.yandexcloud.net/ichiban-photos/male.png'

  const discountNext = profile && !isNew
    ? profile.total_orders < 5 ? { need: 5 - profile.total_orders, val: 5 } :
      profile.total_orders < 10 ? { need: 10 - profile.total_orders, val: 10 } :
      profile.total_orders < 20 ? { need: 20 - profile.total_orders, val: 15 } :
      null
    : null

  return (
    <AnimatePresence>
      {open && (
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          >
          <motion.div
            className="profile-sheet"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >

            {isNew ? (
              <>
                <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 12 }}>👤</div>
                <div className="profile-name" style={{ textAlign: 'center' }}>Вы не авторизованы</div>
                <div className="profile-sub" style={{ textAlign: 'center', marginBottom: 24 }}>
                  Поделитесь номером телефона — мы подтянем ваши заказы и персональную скидку
                </div>
                <button
                  onClick={() => requestPhone(userId, setProfile)}
                  style={{
                    width: '100%', padding: 14,
                    background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`,
                    border: 'none', borderRadius: 12, color: '#fff',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  📱 Поделиться номером
                </button>
              </>
            ) : (
              <>
                <div className="profile-avatar">
                  <img src={avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div className="profile-name">{profile!.name}</div>
                <div className="profile-sub">{profile!.phone || 'Телефон не указан'}</div>

                <div className="profile-stat">
                  <span>Заказов всего</span>
                  <span className="profile-stat-val">{profile!.total_orders}</span>
                </div>
                <div className="profile-stat">
                  <span>Сумма за этот месяц</span>
                  <span className="profile-stat-val">{profile!.month_sum.toLocaleString('ru')} ₽</span>
                </div>

                {profile!.discount > 0 && (
                  <div className="profile-discount">
                    <span className="profile-discount-label">Ваша скидка</span>
                    <span
                      className="profile-discount-val"
                      style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      {profile!.discount}%
                    </span>
                  </div>
                )}

                {discountNext && (
                  <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'var(--sub)' }}>
                    Ещё {discountNext.need} {discountNext.need === 1 ? 'заказ' : 'заказа'} — и скидка {discountNext.val}% 🎁
                  </div>
                )}
              </>
            )}

            <button onClick={onClose} style={{ width: '100%', marginTop: 20, padding: 13, background: 'var(--card-hover)', border: 'none', borderRadius: 12, color: '#aaa', fontSize: 14, cursor: 'pointer' }}>
              Закрыть
            </button>
          </motion.div>
          </motion.div>
      )}
    </AnimatePresence>

  )
}
