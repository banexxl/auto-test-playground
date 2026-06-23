import { NextResponse } from "next/server"

export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const city = searchParams.get("city") || "London"
     const units = searchParams.get("units") || "metric"

     // Example: OpenWeatherMap API (replace with your own API key)
     const apiKey = process.env.OPENWEATHER_API_KEY
     const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`

     const res = await fetch(url)
     const data = await res.json()

     return NextResponse.json(data)
}
