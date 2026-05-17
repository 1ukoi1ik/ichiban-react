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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandPicker />
          </motion.div>
        )}
        {screen === 'menu' && (
          <motion.div
            key="menu"
            className="screen-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
