import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void
        expand(): void
        initDataUnsafe?: { user?: { id?: number } }
      }
    }
  }
}

export function useTelegram() {
  const setUserId = useAppStore((s) => s.setUserId)
  const setProfile = useAppStore((s) => s.setProfile)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }

    const uid = tg?.initDataUnsafe?.user?.id ?? null
    if (uid) {
      setUserId(uid)
      fetch(`${API}/profile/${uid}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) setProfile(data)
        })
        .catch(() => {})
    }
  }, [setUserId, setProfile])
}
