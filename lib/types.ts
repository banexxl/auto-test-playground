export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    zipCode: string
  }
  created_at: string
  status: "pending" | "confirmed" | "shipped" | "delivered"
}
