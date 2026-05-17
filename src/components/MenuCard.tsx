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
}

export default function MenuCard({ item, brandRed, brandOrange, expandedId, onExpand, animDelay = 0 }: Props) {
  const addToCart = useAppStore((s) => s.addToCart)
  const removeFromCart = useAppStore((s) => s.removeFromCart)
  const cart = useAppStore((s) => s.cart)
  const qty = cart[item.id]?.qty ?? 0
  const isExpanded = expandedId === item.id
  const wrapRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const images = item.imgs?.length ? item.imgs : [item.img]
  const hasGallery = images.length > 1

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.card-gallery-wrap')) return
    onExpand(isExpanded ? null : item.id, wrapRef.current)
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
          <div className="card-gallery-wrap" onClick={(e) => e.stopPropagation()}>
            <div className="card-gallery" style={{ transform: `translateX(-${imgIdx * 100}%)`, transition: 'transform 0.3s ease' }}>
              {images.map((src, i) => (
                <div key={i} className="card-gallery-slide">
                  <img src={src} alt={item.name} loading="lazy" draggable={false} className="loaded" />
                </div>
              ))}
            </div>
            <div className="card-gallery-dots" id={`dots-${item.id}`}>
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`card-gallery-dot${i === imgIdx ? ' active' : ''}`}
                  onClick={() => setImgIdx(i)}
                />
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

          <button
            className={`add-btn${qty > 0 ? ' in-cart' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              if (qty > 0) {
                removeFromCart(item.id)
              } else {
                addToCart(item.id, item.name, item.price, item.img)
              }
            }}
          >
            {qty > 0 ? `🛒 В корзине: ${qty}` : 'Добавить в корзину'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
