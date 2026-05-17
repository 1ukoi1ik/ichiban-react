import { useState } from 'react'
import { motion } from 'framer-motion'
import { BRANDS, BRAND_KEYS, BRAND_THUMBS } from '../data/brands'
import { useAppStore } from '../store/useAppStore'
import type { BrandKey } from '../data/types'

export default function BrandPicker() {
  const setBrandKey = useAppStore((s) => s.setBrandKey)
  const setScreen = useAppStore((s) => s.setScreen)
  const [flipping, setFlipping] = useState<BrandKey | null>(null)

  function pick(key: BrandKey) {
    if (flipping) return
    setFlipping(key)
    setBrandKey(key)
    setTimeout(() => setScreen('menu'), 280)
  }

  return (
    <div className="screen screen-picker">
      <div className="picker-header">
        <h1 className="picker-title">Выберите доставку</h1>
      </div>
      <div className="picker-grid">
        {BRAND_KEYS.map((key, i) => {
          const brand = BRANDS[key]
          const isFlipping = flipping === key
          return (
            <motion.button
              key={key}
              className="picker-card"
              onClick={() => pick(key)}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                rotateY: isFlipping ? 90 : 0,
              }}
              transition={isFlipping
                ? { rotateY: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }
                : { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
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
    </div>
  )
}
