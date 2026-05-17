import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRANDS } from '../data/brands'
import { useAppStore, cartCount } from '../store/useAppStore'
import { OPEN_FROM, OPEN_TO } from '../data/api'
import MenuCard from './MenuCard'
import CartSheet from './CartSheet'
import ProfileSheet from './ProfileSheet'
import HistorySheet from './HistorySheet'
import ActiveOrderBanner from './ActiveOrderBanner'

const CAT_NAMES: Record<string, string> = {
  top: '🔥 Хиты', rolls: 'Роллы', sushi: 'Суши', sets: 'Сеты',
  hot: 'Горячее', pizza: 'Пицца', burgers: 'Бургеры', sides: 'Гарниры',
  soups: 'Супы', salads: 'Салаты', drinks: 'Напитки', desserts: 'Десерты',
}

const ABOUT_ITEMS = [
  '⭐ 4.9 · 2 400 отзывов',
  '🚚 Бесплатная доставка от 500 ₽',
  '🕐 Работаем с 10:00 до 22:00',
  '📍 Доставка по всему городу',
  '📞 +7 (999) 123-45-67',
  '💬 Среднее время доставки 35–45 мин',
]

function isOpen() {
  const h = new Date().getHours()
  return h >= OPEN_FROM && h < OPEN_TO
}

export default function MenuScreen() {
  const brandKey = useAppStore((s) => s.brandKey)
  const currentCat = useAppStore((s) => s.currentCat)
  const setCurrentCat = useAppStore((s) => s.setCurrentCat)
  const setScreen = useAppStore((s) => s.setScreen)
  const cart = useAppStore((s) => s.cart)
  const profile = useAppStore((s) => s.profile)
  const cartOpen = useAppStore((s) => s.cartOpen)
  const setCartOpen = useAppStore((s) => s.setCartOpen)
  const count = cartCount(cart)

  const brand = BRANDS[brandKey]
  const [catOpen, setCatOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [open, setOpen] = useState(isOpen())
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollLockRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const expandedElRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const interval = setInterval(() => setOpen(isOpen()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const [autoCard, setAutoCard] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('card') === '1') {
      setProfileOpen(true)
      setAutoCard(true)
    }
  }, [])

  const filteredItems = currentCat === 'top'
    ? brand.menu.filter((i) => i.tags.includes('hit'))
    : brand.menu.filter((i) => i.cat === currentCat)

  function handleExpand(id: number | null, el: HTMLDivElement | null) {
    setExpandedId(id)
    expandedElRef.current = el

    if (id !== null && el && scrollRef.current) {
      const screen = scrollRef.current
      const screenH = screen.clientHeight
      const screenCenter = screenH / 2
      const rect = el.getBoundingClientRect()
      const cardCenter = rect.top + rect.height / 2
      const delta = cardCenter - screenCenter
      scrollLockRef.current = true
      screen.scrollBy({ top: delta, behavior: 'smooth' })
      setTimeout(() => { scrollLockRef.current = false }, 450)
    }
  }

  const applyDrum = useCallback(() => {
    const screen = scrollRef.current
    if (!screen) return
    const screenH = screen.clientHeight
    const centerY = screenH / 2
    screen.querySelectorAll<HTMLDivElement>('.card-drum-wrap').forEach((wrap) => {
      const card = wrap.querySelector<HTMLDivElement>('.food-card')
      if (card?.classList.contains('expanded')) { wrap.style.transform = 'scale(1)'; return }
      const rect = wrap.getBoundingClientRect()
      const dist = Math.abs(centerY - (rect.top + rect.height / 2))
      const t = Math.min(dist / (screenH * 0.55), 1)
      wrap.style.transform = `scale(${(1 - t * 0.07).toFixed(4)})`
    })
  }, [])

  useEffect(() => {
    const screen = scrollRef.current
    if (!screen) return

    function onScroll() {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        applyDrum()
        if (!scrollLockRef.current && expandedElRef.current) {
          const rect = expandedElRef.current.getBoundingClientRect()
          const screenH = window.innerHeight
          const hiddenTop = rect.bottom < rect.height * 0.3
          const hiddenBot = rect.top > screenH - rect.height * 0.3
          if (hiddenTop || hiddenBot) {
            setExpandedId(null)
            expandedElRef.current = null
          }
        }
        rafRef.current = null
      })
    }

    screen.addEventListener('scroll', onScroll, { passive: true })
    return () => screen.removeEventListener('scroll', onScroll)
  }, [applyDrum])

  useEffect(() => {
    setExpandedId(null)
    expandedElRef.current = null
    requestAnimationFrame(applyDrum)
  }, [currentCat, brandKey, applyDrum])

  const catLabel = CAT_NAMES[currentCat] ?? currentCat

  return (
    <div className="screen screen-menu">
      <div ref={scrollRef} style={{ position: 'fixed', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }} onClick={() => { setCatOpen(false); setAboutOpen(false) }}>

        {/* Hero */}
        <div className="hero">
          <div className="hero-bg loaded" style={{ backgroundImage: `url('${brand.hero}')` }} />
          <div className="hero-overlay" />
          <button className="change-btn" onClick={() => setScreen('picker')}>← Сменить</button>
          <div className="hero-content">
            <div
              className="restaurant-name"
              style={{ background: `linear-gradient(135deg, #FFFFFF 0%, #F5A87A 60%, ${brand.orange} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {brand.name}
            </div>
            <div className="hero-status-row">
              <div className={`restaurant-badge${open ? '' : ' closed'}`}>
                {open ? '● Открыто сейчас' : `● Закрыто · откроем в ${OPEN_FROM}:00`}
              </div>
              {profile && (
                <div className="restaurant-badge" style={{ marginTop: 6, color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)' }}>
                  👋 Рады снова видеть, {profile.name.split(' ')[0]}!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky nav */}
        <div className="sticky-nav" id="sticky-nav">
          {/* Категории */}
          <div className={`cat-trigger${catOpen ? ' open' : ''}`} onClick={(e) => { e.stopPropagation(); setCatOpen(!catOpen); setAboutOpen(false) }}>
            <span>☰</span>
            <span
              className="cat-active-label"
              style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {catLabel}
            </span>
            <span className="cat-trigger-arrow">▼</span>

            <AnimatePresence>
              {catOpen && (
                <motion.div
                  className="cat-dropdown open"
                  initial={{ scale: 0.92, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {brand.cats.map((cat) => (
                    <div
                      key={cat.key}
                      className={`cat-option${currentCat === cat.key ? ' active' : ''}`}
                      onClick={() => { setCurrentCat(cat.key); setCatOpen(false); setExpandedId(null) }}
                    >
                      <span className="cat-opt-dot" />
                      {CAT_NAMES[cat.key] ?? cat.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Профиль */}
          <div className="cat-trigger" onClick={(e) => { e.stopPropagation(); setProfileOpen(true) }}>
            <span>👤</span>
            <span className="cat-active-label" style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Профиль
            </span>
          </div>

          {/* О нас */}
          <div
            className={`cat-trigger about-trigger${aboutOpen ? ' open' : ''}`}
            style={{ marginLeft: 'auto' }}
            onClick={(e) => { e.stopPropagation(); setAboutOpen(!aboutOpen); setCatOpen(false) }}
          >
            <span>ℹ️</span>
            <span className="cat-active-label" style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              О нас
            </span>
            <span className="cat-trigger-arrow">▼</span>

            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  className="cat-dropdown about-dropdown open"
                  initial={{ scale: 0.92, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {ABOUT_ITEMS.map((item) => (
                    <div key={item} className="about-item">{item}</div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Баннер активного заказа */}
        <div style={{ padding: '10px 16px 0' }}>
          <ActiveOrderBanner brandRed={brand.red} brandOrange={brand.orange} />
        </div>

        {/* Карточки */}
        <div style={{ padding: '12px 16px 0' }}>
          <div className="cards-grid">
            {filteredItems.map((item, idx) => (
              <MenuCard
                key={item.id}
                item={item}
                brandRed={brand.red}
                brandOrange={brand.orange}
                expandedId={expandedId}
                onExpand={handleExpand}
                animDelay={Math.min(idx * 0.045, 0.18)}
              />
            ))}
          </div>
          <div style={{ height: 110 }} />
        </div>
      </div>

      {/* FAB */}
      <motion.button
        className={`cart-fab${count > 0 ? ' has-items' : ''}`}
        onClick={() => setCartOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.4 }}
        style={{ background: count > 0 ? `linear-gradient(135deg, ${brand.red}, ${brand.orange})` : 'var(--card)' }}
      >
        🛒
        {count > 0 && <span className="fab-badge">{count}</span>}
      </motion.button>

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setScreen('checkout') }}
        onHistory={() => { setCartOpen(false); setHistoryOpen(true) }}
        brandRed={brand.red}
        brandOrange={brand.orange}
      />

      <ProfileSheet
        open={profileOpen}
        onClose={() => { setProfileOpen(false); setAutoCard(false) }}
        onHistory={() => { setProfileOpen(false); setHistoryOpen(true) }}
        brandRed={brand.red}
        brandOrange={brand.orange}
        autoCard={autoCard}
      />

      <HistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpenCart={() => { setHistoryOpen(false); setCartOpen(true) }}
        brandRed={brand.red}
        brandOrange={brand.orange}
      />
    </div>
  )
}
