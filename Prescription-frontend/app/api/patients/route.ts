import { type NextRequest, NextResponse } from "next/server"

// Mock database - in a real app, this would be a proper database
const patients: Array<{
  id: string
  name: string
  age: number
  gender: string
  email: string
}> = [
  {
    id: "1",
    name: "John Doe",
    age: 35,
    gender: "Male",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    email: "jane@example.com",
  },
]

export async function GET() {
  return NextResponse.json(patients)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, age, gender, email } = body

    // Validate required fields
    if (!name || !age || !gender || !email) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Check if email already exists
    const existingPatient = patients.find((p) => p.email === email)
    if (existingPatient) {
      return new NextResponse("Patient with this email already exists", { status: 409 })
    }

    // Create new patient
    const newPatient = {
      id: (patients.length + 1).toString(),
      name,
      age: Number.parseInt(age),
      gender,
      email,
    }

    patients.push(newPatient)

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    return new NextResponse("Invalid request body", { status: 400 })
  }
}
