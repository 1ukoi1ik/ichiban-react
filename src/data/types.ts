export interface MenuItem {
  id: number
  cat: string
  name: string
  price: number
  weight: string
  desc: string
  tags: string[]
  cal: string
  img: string
  imgs?: string[]
}

export interface Category {
  key: string
  label: string
}

export interface Brand {
  name: string
  red: string
  orange: string
  hero: string
  cats: Category[]
  menu: MenuItem[]
}

export type BrandKey = 'sushi' | 'pizza' | 'burger' | 'shawarma' | 'pasta' | 'georgian' | 'ramen'

export interface CartItem {
  name: string
  price: number
  qty: number
  img: string
}

export interface Cart {
  [id: number]: CartItem
}

export interface Profile {
  ok: boolean
  new_client?: boolean
  name: string
  phone: string
  address?: string
  addresses?: string[]
  total_orders: number
  total_sum: number
  month_sum: number
  discount: number
}

export interface Order {
  num: string
  step: number
  total: number
  items: { name: string; qty: number; price: number }[]
  date: string
}
