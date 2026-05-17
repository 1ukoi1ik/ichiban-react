import { motion } from 'framer-motion'
import { BRANDS, BRAND_KEYS, BRAND_THUMBS } from '../data/brands'
import { useAppStore } from '../store/useAppStore'
import type { BrandKey } from '../data/types'

export default function BrandPicker() {
  const setBrandKey = useAppStore((s) => s.setBrandKey)
  const setScreen = useAppStore((s) => s.setScreen)

  function pick(key: BrandKey) {
    setBrandKey(key)
    setScreen('menu')
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
              onClick={() => pick(key)}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.96 }}
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
