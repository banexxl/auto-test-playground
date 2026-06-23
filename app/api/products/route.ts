import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let url = "https://fakestoreapi.com/products"
    if (category) {
      url += `/category/${category}`
    }

    const response = await fetch(url)
    const products = await response.json()

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
