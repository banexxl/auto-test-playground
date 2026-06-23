import { type NextRequest, NextResponse } from "next/server"
import products from "./products.json"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const filteredProducts = category
      ? products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase()
      )
      : products

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}