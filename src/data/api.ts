export const API = 'https://ichiban-sushi-bot-production.up.railway.app'
export const OPEN_FROM = 10
export const OPEN_TO = 22

export function isOpen(): boolean {
  const h = new Date().getHours()
  return h >= OPEN_FROM && h < OPEN_TO
}

export function genOrderNum(): string {
  return '#' + Math.floor(1000 + Math.random() * 9000)
}
