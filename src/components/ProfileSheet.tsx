import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

interface Props {
  open: boolean
  onClose: () => void
  onHistory: () => void
  brandRed: string
  brandOrange: string
  autoCard?: boolean
}

function guessGender(name: string) {
  const last = name.split(' ')[0].slice(-1).toLowerCase()
  return ['а', 'я', 'ь'].includes(last) ? 'female' : 'male'
}

function requestPhone(setProfile: (p: any) => void) {
  const tg = window.Telegram?.WebApp
  if (!tg) return
  const _tg = tg
  const tgUserId = _tg.initDataUnsafe?.user?.id ?? null

  function onContact(data: any) {
    _tg.offEvent('contactRequested', onContact)
    if (data?.status !== 'sent') return
    const contact = data?.responseUnsafe?.contact ?? data?.contact
    if (!contact) return
    const { phone_number: raw_phone, first_name, last_name } = contact
    const phone_number = raw_phone ? (raw_phone.startsWith('+') ? raw_phone : `+${raw_phone}`) : ''
    const name = [first_name, last_name].filter(Boolean).join(' ')
    setProfile({
      ok: true,
      new_client: false,
      name: name || '',
      phone: phone_number,
      address: '',
      total_orders: 0,
      month_sum: 0,
      discount: 0,
    })
    if (tgUserId && phone_number) {
      fetch(`${API}/profile/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: tgUserId, phone: phone_number, name }),
      })
        .then(() => fetch(`${API}/profile/${tgUserId}`))
        .then((r) => r.json())
        .then((data) => { if (data.ok && !data.new_client) setProfile(data) })
        .catch(() => {})
    }
  }

  _tg.onEvent('contactRequested', onContact)
  _tg.requestContact()
}

export default function ProfileSheet({ open, onClose, onHistory, brandRed, brandOrange, autoCard }: Props) {
  const profile = useAppStore((s) => s.profile)
  const setProfile = useAppStore((s) => s.setProfile)
  const isNew = !profile || profile.new_client
  const [showCard, setShowCard] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  useEffect(() => {
    if (autoCard) setShowCard(true)
  }, [autoCard])

  const AVATARS = [
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal1.png', label: 'Парень 1' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal2.png', label: 'Парень 2' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal3.png', label: 'Парень 3' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal4.png', label: 'Парень 4' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal5.png', label: 'Парень 5' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal6.png', label: 'Парень 6' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/mal7.png', label: 'Парень 7' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem1.png', label: 'Девушка 1' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem2.png', label: 'Девушка 2' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem3.png', label: 'Девушка 3' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem4.png', label: 'Девушка 4' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem5.png', label: 'Девушка 5' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem6.png', label: 'Девушка 6' },
    { url: 'https://storage.yandexcloud.net/ichiban-photos/fem7.png', label: 'Девушка 7' },
  ]

  const currentAvatar = profile?.avatar
    ?? (profile ? (guessGender(profile.name) === 'female'
      ? 'https://storage.yandexcloud.net/ichiban-photos/female.png'
      : 'https://storage.yandexcloud.net/ichiban-photos/male.png') : '')

  function selectAvatar(url: string) {
    if (!profile) return
    setShowAvatarPicker(false)
    setProfile({ ...profile, avatar: url })
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? null
    if (tgUserId) {
      fetch(`${API}/profile/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: tgUserId, avatar: url }),
      }).catch(() => {})
    }
  }

  const TIERS = [
    { at: 3000, val: 5 },
    { at: 7000, val: 10 },
    { at: 15000, val: 15 },
  ]
  const totalSum = profile?.total_sum ?? 0
  const discountNext = profile && !isNew
    ? TIERS.find((t) => totalSum < t.at) ?? null
    : null
  const progressPct = discountNext
    ? Math.min(Math.round((totalSum / discountNext.at) * 100), 100)
    : 100

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
                  onClick={() => requestPhone(setProfile)}
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="profile-avatar" style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => setShowAvatarPicker(true)}>
                  <img src={currentAvatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 20, height: 20, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1,
                    border: '2px solid var(--bg)',
                  }}>+</div>
                </div>
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
                  <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--sub)' }}>До скидки {discountNext.val}%</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                        {totalSum.toLocaleString('ru')} / {discountNext.at.toLocaleString('ru')} ₽
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                      <motion.div
                        key={open ? 'open' : 'closed'}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: `linear-gradient(90deg, ${brandRed}, ${brandOrange})`,
                          borderRadius: 99,
                          boxShadow: `0 0 8px ${brandOrange}66`,
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 7, fontSize: 12, color: 'var(--sub)', textAlign: 'center' }}>
                      ещё {(discountNext.at - totalSum).toLocaleString('ru')} ₽ — и скидка {discountNext.val}% 🎁
                    </div>
                  </div>
                )}
              </>
            )}

            {!isNew && profile!.discount > 0 && (
              <button
                onClick={() => setShowCard(true)}
                style={{
                  width: '100%', marginTop: 16, padding: 14,
                  background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`,
                  border: 'none', borderRadius: 12, color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
              >
                🎟️ Предъявить скидку
              </button>
            )}

            {!isNew && (
              <button
                onClick={() => { onClose(); onHistory() }}
                style={{ width: '100%', marginTop: 10, padding: 13, background: 'var(--card-hover)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}
              >
                🕐 История заказов
              </button>
            )}

            <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: 13, background: 'var(--card-hover)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>
              Закрыть
            </button>

            {/* Пикер аватара */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAvatarPicker(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                >
                  <motion.div
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: 'var(--card)', borderRadius: 20, padding: '20px 16px', width: '100%', maxWidth: 320 }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', textAlign: 'center', marginBottom: 16 }}>Выберите аватар</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {AVATARS.map((a) => (
                        <div key={a.url} onClick={() => selectAvatar(a.url)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                          <img
                            src={a.url} alt={a.label}
                            style={{
                              width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
                              border: currentAvatar === a.url ? `3px solid ${brandOrange}` : '3px solid transparent',
                              transition: 'border 0.15s',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setShowAvatarPicker(false)} style={{ marginTop: 16, width: '100%', padding: 11, background: 'var(--card-hover)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--sub)', fontSize: 13, cursor: 'pointer' }}>
                      Отмена
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Карточка предъявления скидки */}
            <AnimatePresence>
              {showCard && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCard(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                >
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%', maxWidth: 340,
                      background: `linear-gradient(145deg, #1a1a1a, #111)`,
                      border: `2px solid ${brandOrange}55`,
                      borderRadius: 24, padding: '32px 28px',
                      textAlign: 'center', boxShadow: `0 0 40px ${brandRed}33`,
                    }}
                  >
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                      карта постоянного гостя
                    </div>

                    <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.2 }}>
                      {profile!.name}
                    </div>
                    <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
                      {profile!.phone}
                    </div>

                    <div style={{
                      background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`,
                      borderRadius: 16, padding: '20px 0', marginBottom: 24,
                      boxShadow: `0 4px 24px ${brandOrange}44`,
                    }}>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>персональная скидка</div>
                      <div style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {profile!.discount}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                      <div style={{ background: '#fff', borderRadius: 12, padding: 8 }}>
                        <img src="https://storage.yandexcloud.net/ichiban-photos/qr.webp" alt="QR" style={{ width: 120, height: 120, display: 'block' }} />
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                      Покажите эту карту кассиру<br />для получения скидки в заведении
                    </div>

                    <button
                      onClick={() => setShowCard(false)}
                      style={{ marginTop: 24, width: '100%', padding: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}
                    >
                      Закрыть
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </motion.div>
      )}
    </AnimatePresence>

  )
}
