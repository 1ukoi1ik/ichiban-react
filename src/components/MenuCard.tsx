import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MenuItem } from '../data/types'
import { useAppStore } from '../store/useAppStore'

interface Props {
  item: MenuItem
  brandRed: string
  expandedId: number | null
  onExpand: (id: number | null, el: HTMLDivElement | null) => void
  animDelay?: number
}

export default function MenuCard({ item, brandRed, expandedId, onExpand, animDelay = 0 }: Props) {
  const addToCart = useAppStore((s) => s.addToCart)
  const cart = useAppStore((s) => s.cart)
  const qty = cart[item.id]?.qty ?? 0
  const isExpanded = expandedId === item.id
  const wrapRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)

  const images = item.imgs?.length ? item.imgs : [item.img]

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    onExpand(isExpanded ? null : item.id, wrapRef.current)
  }

  return (
    <motion.div
      ref={wrapRef}
      className="card-wrap"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`food-card${isExpanded ? ' expanded' : ''}`}
        onClick={handleClick}
        animate={isExpanded ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.35 }}
        style={{ '--brand-red': brandRed } as React.CSSProperties}
      >
        <div className="card-img-wrap" onClick={(e) => { e.stopPropagation(); if (images.length > 1) setImgIdx((i) => (i + 1) % images.length) }}>
          <img src={images[imgIdx]} alt={item.name} loading="lazy" draggable={false} />
          {images.length > 1 && (
            <div className="img-dots">
              {images.map((_, i) => (
                <span key={i} className={i === imgIdx ? 'dot active' : 'dot'} />
              ))}
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="card-top">
            <span className="card-name">{item.name}</span>
            <span className="card-price">{item.price.toLocaleString()} ₽</span>
          </div>
          <div className="card-meta">
            <span>{item.weight}</span>
            {item.cal && <span>{item.cal}</span>}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="card-desc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p>{item.desc}</p>
                {item.tags.length > 0 && (
                  <div className="card-tags">
                    {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="card-footer">
            {qty === 0 ? (
              <button
                className="btn-add"
                onClick={(e) => { e.stopPropagation(); addToCart(item.id, item.name, item.price, item.img) }}
              >
                + В корзину
              </button>
            ) : (
              <div className="qty-ctrl">
                <button onClick={(e) => { e.stopPropagation(); useAppStore.getState().removeFromCart(item.id) }}>−</button>
                <span>{qty}</span>
                <button onClick={(e) => { e.stopPropagation(); addToCart(item.id, item.name, item.price, item.img) }}>+</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
