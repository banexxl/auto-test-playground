import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables")
}

function createSupabaseRouteClient(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  return { supabase, response }
}

// POST handler — Create new order and order items
export async function POST(request: NextRequest) {
  const { supabase, response } = createSupabaseRouteClient(request)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderData = await request.json()

    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert({
        total: orderData.total,
        created_at: new Date().toISOString(),
        status: "confirmed",
        first_name: orderData.customerInfo.firstName,
        last_name: orderData.customerInfo.lastName,
        email: orderData.customerInfo.email,
        address: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        zip_code: orderData.customerInfo.zipCode,
      })
      .select(
        `
        id,
        total,
        created_at,
        status,
        first_name,
        last_name,
        email,
        address,
        city,
        zip_code
      `
      )
      .single()

    if (orderError) {
      console.error("Failed to create order:", orderError)

      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    const orderItems = orderData.items.map((item: any) => ({
      order_id: orderRow.id,
      product_id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Failed to create order items:", itemsError)

      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      )
    }

    const jsonResponse = NextResponse.json(orderRow)

    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })

    return jsonResponse
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

// GET handler — Fetch orders with items
export async function GET(request: NextRequest) {
  const { supabase, response } = createSupabaseRouteClient(request)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total,
        created_at,
        status,
        first_name,
        last_name,
        email,
        address,
        city,
        zip_code,
        order_items (
          product_id,
          title,
          price,
          image,
          quantity
        )
      `
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch orders:", error)

      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      )
    }

    const orders = data.map((order: any) => ({
      id: order.id,
      total: order.total,
      created_at: order.created_at,
      status: order.status,
      items: (order.order_items || []).map((item: any) => ({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      customerInfo: {
        firstName: order.first_name,
        lastName: order.last_name,
        email: order.email,
        address: order.address,
        city: order.city,
        zipCode: order.zip_code,
      },
    }))

    const jsonResponse = NextResponse.json(orders)

    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })

    return jsonResponse
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}