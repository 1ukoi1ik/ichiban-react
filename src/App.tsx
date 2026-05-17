import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import { useTelegram } from './hooks/useTelegram'
import BrandPicker from './components/BrandPicker'
import MenuScreen from './components/MenuScreen'
import CheckoutScreen from './components/CheckoutScreen'
import SuccessScreen from './components/SuccessScreen'
import './App.css'

export default function App() {
  useTelegram()
  const screen = useAppStore((s) => s.screen)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === 'picker' && (
          <motion.div
            key="picker"
            className="screen-wrapper"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <BrandPicker />
          </motion.div>
        )}
        {screen === 'menu' && (
          <motion.div
            key="menu"
            className="screen-wrapper"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0.2, 1] }}
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
          >
            <MenuScreen />
          </motion.div>
        )}
        {screen === 'checkout' && (
          <motion.div
            key="checkout"
            className="screen-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckoutScreen />
          </motion.div>
        )}
        {screen === 'success' && (
          <motion.div
            key="success"
            className="screen-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <SuccessScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
