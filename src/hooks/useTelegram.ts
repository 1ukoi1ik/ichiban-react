import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { API } from '../data/api'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void
        expand(): void
        initDataUnsafe?: { user?: { id?: number; first_name?: string; phone_number?: string } }
        requestContact(cb?: (status: string, contact?: any) => void): void
        onEvent(event: string, cb: (data: any) => void): void
        offEvent(event: string, cb: (data: any) => void): void
        HapticFeedback?: {
          notificationOccurred(type: 'error' | 'success' | 'warning'): void
          selectionChanged?(): void
          impactOccurred?(style: 'light' | 'medium' | 'heavy'): void
        }
      }
    }
  }
}

export function useTelegram() {
  const setUserId = useAppStore((s) => s.setUserId)
  const setProfile = useAppStore((s) => s.setProfile)
  const storedUserId = useAppStore((s) => s.userId)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }

    function loadProfile(uid: number) {
      setUserId(uid)
      fetch(`${API}/profile/${uid}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok && !data.new_client) {
            setProfile(data)
          } else {
            // новый клиент — подставляем имя из TG
            const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
            if (tgUser?.first_name) {
              setProfile({
                ok: true,
                new_client: true,
                name: tgUser.first_name,
                phone: tgUser.phone_number ?? '',
                address: '',
                total_orders: 0,
                month_sum: 0,
                discount: 0,
              })
            }
          }
        })
        .catch(() => {})
    }

    const uid = tg?.initDataUnsafe?.user?.id
    if (uid) {
      loadProfile(uid)
    } else if (storedUserId) {
      loadProfile(storedUserId)
    } else {
      // Telegram может заполнить initDataUnsafe чуть позже
      const t = setTimeout(() => {
        const uid2 = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
        if (uid2) loadProfile(uid2)
      }, 500)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
