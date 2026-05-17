export const API = 'https://ichiban-sushi-bot-production.up.railway.app'
export const OPEN_FROM = 10
export const OPEN_TO = 22

export function isOpen(): boolean {
  const h = new Date().getHours()
  return h >= OPEN_FROM && h < OPEN_TO
}

export function genOrderNum(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-4)
  const rnd = Math.floor(100 + Math.random() * 900)
  return `#${ts}${rnd}`
}
