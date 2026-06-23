import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`)
    const product = await response.json()

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
