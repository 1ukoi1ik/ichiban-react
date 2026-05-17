import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { MenuItem } from '../data/types'
import { useAppStore } from '../store/useAppStore'

const TAG_LABELS: Record<string, string> = {
  hit: '🔥 Хит',
  new: '✨ Новинка',
  hot: '🌶 Острое',
  veg: '🥦 Вегетарианское',
  sale: '💸 Скидка',
}

interface Props {
  item: MenuItem
  brandRed: string
  brandOrange: string
  expandedId: number | null
  onExpand: (id: number | null, el: HTMLDivElement | null) => void
  animDelay?: number
  compact?: boolean
}

export default function MenuCard({ item, brandRed, brandOrange, expandedId, onExpand, animDelay = 0, compact }: Props) {
  const addToCart = useAppStore((s) => s.addToCart)
  const removeFromCart = useAppStore((s) => s.removeFromCart)
  const cart = useAppStore((s) => s.cart)
  const qty = cart[item.id]?.qty ?? 0
  const isExpanded = expandedId === item.id
  const wrapRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const galleryScrolling = useRef(false)

  const images = item.imgs?.length ? item.imgs : [item.img]
  const hasGallery = images.length > 1

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    if (galleryScrolling.current) return
    onExpand(isExpanded ? null : item.id, wrapRef.current)
  }

  if (compact) {
    return (
      <motion.div
        className="card-drum-wrap"
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="food-card food-card--compact" onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; onExpand(null, null) }}>
          <div className={`card-image-wrap card-image-wrap--compact${imgLoaded ? ' img-loaded' : ''}`}>
            <div className="shimmer-layer" />
            <img
              src={item.img}
              alt={item.name}
              className={`card-image${imgLoaded ? ' loaded' : ''}`}
              loading="lazy"
              draggable={false}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="card-grad" />
          </div>
          <div className="card-body card-body--compact">
            <div className="card-name card-name--compact">{item.name}</div>
            <div className="card-compact-footer">
              <div className="card-compact-price-block">
                <span className="card-price--compact">
                  {item.price} ₽
                </span>
                <span className="card-weight">{item.weight}</span>
              </div>
              {qty > 0 ? (
                <div className="qty-ctrl qty-ctrl--compact" onClick={(e) => e.stopPropagation()}>
                  <button className="qty-btn qty-btn--sm" onClick={() => removeFromCart(item.id)}>−</button>
                  <span className="qty-num qty-num--sm">{qty}</span>
                  <button className="qty-btn qty-btn--sm" onClick={() => addToCart(item.id, item.name, item.price, item.img)}>+</button>
                </div>
              ) : (
                <button
                  className="add-btn add-btn--compact"
                  onClick={(e) => { e.stopPropagation(); addToCart(item.id, item.name, item.price, item.img) }}
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={wrapRef}
      className="card-drum-wrap"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`food-card${isExpanded ? ' expanded' : ''}`}
        onClick={handleClick}
        animate={isExpanded ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.35 }}
      >
        {/* Image / Gallery */}
        {hasGallery ? (
          <div className="card-gallery-wrap">
            <div
              className="card-gallery"
              onScroll={(e) => {
                galleryScrolling.current = true
                const el = e.currentTarget
                const idx = Math.round(el.scrollLeft / el.offsetWidth)
                setImgIdx(idx)
                setTimeout(() => { galleryScrolling.current = false }, 200)
              }}
            >
              {images.map((src, i) => (
                <div key={i} className="card-gallery-slide">
                  <img src={src} alt={item.name} loading="lazy" draggable={false} className="loaded" />
                </div>
              ))}
            </div>
            <div className="card-gallery-dots">
              {images.map((_, i) => (
                <span key={i} className={`card-gallery-dot${i === imgIdx ? ' active' : ''}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className={`card-image-wrap${imgLoaded ? ' img-loaded' : ''}`}>
            <div className="shimmer-layer" />
            <img
              src={item.img}
              alt={item.name}
              className={`card-image${imgLoaded ? ' loaded' : ''}`}
              loading="lazy"
              draggable={false}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="card-grad" />
            {item.cal && <div className="card-cal-badge">{item.cal}</div>}
          </div>
        )}

        {/* Body */}
        <div className="card-body">
          <div className="card-top">
            <div className="card-name">{item.name}</div>
            <div className="card-price-wrap">
              <span
                className="card-price"
                style={{ background: `linear-gradient(135deg, ${brandRed}, ${brandOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {item.price} ₽
              </span>
              <span className="card-weight">{item.weight}</span>
            </div>
          </div>

          {/* Desc — раскрывается CSS grid-rows trick */}
          <div className={`card-desc-wrap${isExpanded ? ' open' : ''}`}>
            <div>
              {item.tags.length > 0 && (
                <div className="card-tags">
                  {item.tags.map((t) => (
                    <span key={t} className={`tag ${t}`}>{TAG_LABELS[t] ?? t}</span>
                  ))}
                </div>
              )}
              <div className="card-desc">{item.desc}</div>
            </div>
          </div>

          {qty > 0 ? (
            <div className="qty-ctrl card-qty" onClick={(e) => e.stopPropagation()}>
              <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => addToCart(item.id, item.name, item.price, item.img)}>+</button>
            </div>
          ) : (
            <button
              className="add-btn"
              onClick={(e) => { e.stopPropagation(); addToCart(item.id, item.name, item.price, item.img) }}
            >
              Добавить в корзину
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
