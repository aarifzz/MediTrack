import { type NextRequest, NextResponse } from "next/server"

// Mock prescriptions storage
const prescriptions: Array<{
  id: string
  patientId: string
  diagnosis: string
  medicine: string
  dosage: string
  frequency: string
  createdAt: string
}> = []

export async function POST(request: NextRequest, { params }: { params: { patientId: string } }) {
  try {
    const body = await request.json()
    const { diagnosis, medicine, dosage, frequency } = body
    const { patientId } = params

    // Validate required fields
    if (!diagnosis || !medicine || !dosage || !frequency) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Create new prescription
    const newPrescription = {
      id: (prescriptions.length + 1).toString(),
      patientId,
      diagnosis,
      medicine,
      dosage,
      frequency,
      createdAt: new Date().toISOString(),
    }

    prescriptions.push(newPrescription)

    // Simulate email sending (in a real app, this would send an actual email with PDF)
    console.log(`Email with prescription PDF sent for patient ${patientId}`)

    return NextResponse.json(newPrescription, { status: 201 })
  } catch (error) {
    return new NextResponse("Invalid request body", { status: 400 })
  }
}
