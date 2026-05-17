import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRANDS } from '../data/brands'
import { useAppStore, cartCount } from '../store/useAppStore'
import MenuCard from './MenuCard'
import CartSheet from './CartSheet'

const CAT_NAMES: Record<string, string> = {
  top: '🔥 Хиты',
  rolls: 'Роллы',
  sushi: 'Суши',
  sets: 'Сеты',
  hot: 'Горячее',
  pizza: 'Пицца',
  burgers: 'Бургеры',
  sides: 'Гарниры',
  soups: 'Супы',
  salads: 'Салаты',
  drinks: 'Напитки',
  desserts: 'Десерты',
}

export default function MenuScreen() {
  const brandKey = useAppStore((s) => s.brandKey)
  const currentCat = useAppStore((s) => s.currentCat)
  const setCurrentCat = useAppStore((s) => s.setCurrentCat)
  const setScreen = useAppStore((s) => s.setScreen)
  const cart = useAppStore((s) => s.cart)
  const count = cartCount(cart)

  const brand = BRANDS[brandKey]
  const [cartOpen, setCartOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollLockRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const expandedElRef = useRef<HTMLDivElement | null>(null)

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
      {/* Hero — фото бренда с затемнением */}
      <div id="screen-menu" ref={scrollRef} style={{ position: 'fixed', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        {/* Hero секция */}
        <div className="hero">
          <div
            id="hero-bg"
            className="hero-bg loaded"
            style={{ backgroundImage: `url('${brand.hero}')` }}
          />
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
              <div className="restaurant-badge">● Открыто сейчас</div>
            </div>
          </div>
        </div>

        {/* Sticky nav */}
        <div className="sticky-nav" id="sticky-nav">
          <div className={`cat-trigger${catOpen ? ' open' : ''}`} onClick={() => setCatOpen(!catOpen)}>
            <span>☰</span>
            <span className="cat-active-label" style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
                      onClick={() => {
                        setCurrentCat(cat.key)
                        setCatOpen(false)
                        setExpandedId(null)
                      }}
                    >
                      <span className="cat-opt-dot" />
                      {CAT_NAMES[cat.key] ?? cat.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Список карточек */}
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

      {/* FAB корзины — круглая кнопка с badge, как в оригинале */}
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            className={`cart-fab${count > 0 ? ' has-items' : ''}`}
            onClick={() => setCartOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.4 }}
            style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})` }}
          >
            🛒
            <span className="fab-badge">{count}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setScreen('checkout') }}
        brandRed={brand.red}
        brandOrange={brand.orange}
      />
    </div>
  )
}
