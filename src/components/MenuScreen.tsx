import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { BRANDS } from '../data/brands'
import { useAppStore, cartCount, cartTotal } from '../store/useAppStore'
import MenuCard from './MenuCard'
import CartSheet from './CartSheet'

export default function MenuScreen() {
  const brandKey = useAppStore((s) => s.brandKey)
  const currentCat = useAppStore((s) => s.currentCat)
  const setCurrentCat = useAppStore((s) => s.setCurrentCat)
  const setScreen = useAppStore((s) => s.setScreen)
  const setBrandKey = useAppStore((s) => s.setBrandKey)
  const cart = useAppStore((s) => s.cart)
  const profile = useAppStore((s) => s.profile)

  const brand = BRANDS[brandKey]
  const count = cartCount(cart)
  const total = cartTotal(cart)
  const discount = profile?.discount ?? 0
  const finalTotal = discount ? Math.round(total * (1 - discount / 100)) : total

  const [cartOpen, setCartOpen] = useState(false)
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
      const navH = 100
      const rect = el.getBoundingClientRect()
      const screenH = screen.clientHeight
      const screenCenter = navH + (screenH - navH) / 2
      const cardCenter = rect.top + rect.height / 2
      const delta = cardCenter - screenCenter
      scrollLockRef.current = true
      screen.scrollBy({ top: delta, behavior: 'smooth' })
      setTimeout(() => { scrollLockRef.current = false }, 400)
    }
  }

  const applyDrum = useCallback(() => {
    const screen = scrollRef.current
    if (!screen) return
    const screenH = screen.clientHeight
    const centerY = screenH / 2
    screen.querySelectorAll<HTMLDivElement>('.card-wrap').forEach((wrap) => {
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
          const navH = 100
          const rect = expandedElRef.current.getBoundingClientRect()
          const screenH = window.innerHeight
          const hiddenTop = rect.bottom < navH + rect.height * 0.3
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
    requestAnimationFrame(applyDrum)
  }, [currentCat, brandKey, applyDrum])

  return (
    <div className="screen screen-menu">
      {/* Header */}
      <div className="menu-header" style={{ background: `linear-gradient(135deg, ${brand.red}, ${brand.orange})` }}>
        <div className="menu-header-row">
          <button className="btn-back" onClick={() => { setBrandKey(brandKey); setScreen('picker') }}>←</button>
          <span className="menu-brand-name">{brand.name}</span>
          {profile && (
            <div className="menu-discount-badge">
              {profile.discount > 0 ? `−${profile.discount}%` : '🎁'}
            </div>
          )}
        </div>

        {/* Hero */}
        {brand.hero && (
          <div className="menu-hero">
            <img src={brand.hero} alt={brand.name} />
          </div>
        )}

        {/* Categories */}
        <div className="cats-row">
          {brand.cats.map((cat) => (
            <button
              key={cat.key}
              className={`cat-btn${currentCat === cat.key ? ' active' : ''}`}
              style={currentCat === cat.key ? { background: brand.red, borderColor: brand.red } : {}}
              onClick={() => { setCurrentCat(cat.key); setExpandedId(null) }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable menu */}
      <div className="menu-scroll" ref={scrollRef}>
        <div className="menu-list">
          {filteredItems.map((item, idx) => (
            <MenuCard
              key={item.id}
              item={item}
              brandRed={brand.red}
              expandedId={expandedId}
              onExpand={handleExpand}
              animDelay={Math.min(idx * 0.04, 0.18)}
            />
          ))}
          <div style={{ height: 120 }} />
        </div>
      </div>

      {/* FAB cart */}
      {count > 0 && (
        <motion.button
          className="fab-cart"
          style={{ background: brand.red }}
          onClick={() => setCartOpen(true)}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
        >
          <span className="fab-count">{count}</span>
          <span className="fab-label">Корзина</span>
          <span className="fab-total">{finalTotal.toLocaleString()} ₽</span>
        </motion.button>
      )}

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => setScreen('checkout')}
        brandRed={brand.red}
      />
    </div>
  )
}
