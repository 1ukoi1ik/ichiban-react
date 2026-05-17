export const API = 'https://ichiban-sushi-bot-production.up.railway.app'
export const OPEN_FROM = 10
export const OPEN_TO = 22

export function isOpen(): boolean {
  const h = new Date().getHours()
  return h >= OPEN_FROM && h < OPEN_TO
}

export async function genOrderNum(): Promise<string> {
  try {
    const r = await fetch(`${API}/next-order-num`)
    const data = await r.json()
    if (data.num) return data.num
  } catch { /* ignore */ }
  return '#' + Math.floor(1000 + Math.random() * 9000)
}
