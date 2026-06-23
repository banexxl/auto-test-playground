import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In a real app, you'd use a database
let formDataStore: Array<{
  id: string
  username: string
  email: string
  age: number
  bio: string
  salary: number
  created_at: string
}> = []

export async function GET() {
  return NextResponse.json(formDataStore)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { username, email, age, bio, salary } = body

    if (!username || !email || !age || !bio || !salary) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      username,
      email,
      age: Number(age),
      bio,
      salary: Number(salary),
      created_at: new Date().toISOString(),
    }

    // Add to store
    formDataStore.push(newEntry)

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE() {
  formDataStore = []
  return NextResponse.json({ message: "All data cleared" })
}
