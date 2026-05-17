import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRANDS, BRAND_KEYS, BRAND_THUMBS } from '../data/brands'
import { useAppStore } from '../store/useAppStore'
import type { BrandKey } from '../data/types'

type Rect = { top: number; left: number; width: number; height: number }

export default function BrandPicker() {
  const setBrandKey = useAppStore((s) => s.setBrandKey)
  const setScreen = useAppStore((s) => s.setScreen)
  const [overlay, setOverlay] = useState<{ key: BrandKey; rect: Rect } | null>(null)
  const lockRef = useRef(false)

  function pick(key: BrandKey, e: React.MouseEvent<HTMLButtonElement>) {
    if (lockRef.current) return
    lockRef.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    setBrandKey(key)
    setOverlay({ key, rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
    // переход экрана на середине флипа
    setTimeout(() => setScreen('menu'), 320)
  }

  return (
    <div className="screen screen-picker">
      <div className="picker-header">
        <h1 className="picker-title">Выберите доставку</h1>
      </div>
      <div className="picker-grid">
        {BRAND_KEYS.map((key, i) => {
          const brand = BRANDS[key]
          return (
            <motion.button
              key={key}
              className="picker-card"
              onClick={(e) => pick(key, e)}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: overlay ? (overlay.key === key ? 0 : 1) : 1, y: 0, scale: 1 }}
              transition={{ delay: overlay ? 0 : i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="picker-card-img-wrap">
                <img src={BRAND_THUMBS[key]} alt={brand.name} className="picker-card-img" draggable={false} />
                <div className="picker-card-gradient" style={{ background: `linear-gradient(to bottom, transparent 60%, ${brand.red}55 100%)` }} />
              </div>
              <span className="picker-name">{brand.name}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {overlay && (
          <motion.div
            key="flip-overlay"
            className="picker-flip-overlay"
            initial={{
              top: overlay.rect.top,
              left: overlay.rect.left,
              width: overlay.rect.width,
              height: overlay.rect.height,
              borderRadius: 20,
              rotateY: 0,
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
              rotateY: 90,
            }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.6, 1] }}
            style={{ perspective: 1200 }}
          >
            <img
              src={BRAND_THUMBS[overlay.key]}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
