"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  email: string
}

export default function CreatePrescription({ params }: { params: { patientId: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    diagnosis: "",
    medicine: "",
    dosage: "",
    frequency: "",
  })
  const [loading, setLoading] = useState(false)
  const [fetchingPatient, setFetchingPatient] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPatient()
  }, [params.patientId])

  const fetchPatient = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/patients")
      if (response.ok) {
        const patients = await response.json()
        const foundPatient = patients.find((p: Patient) => p.id === Number(params.patientId))
        if (foundPatient) {
          setPatient(foundPatient)
        } else {
          toast({
            title: "Error",
            description: "Patient not found",
            variant: "destructive",
          })
          router.push("/")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patient details",
        variant: "destructive",
      })
    } finally {
      setFetchingPatient(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.diagnosis || !formData.medicine || !formData.dosage || !formData.frequency) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:8080/api/prescriptions/patient/${params.patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prescription created and email sent!",
        })
        router.push("/")
      } else {
        const error = await response.text()
        toast({
          title: "Error",
          description: error || "Failed to create prescription",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient not found</h2>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prescription</h1>
          <p className="text-gray-600">Create a new prescription for the patient</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-lg font-semibold">{patient.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Age</Label>
                  <p className="text-lg">{patient.age} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Gender</Label>
                  <p className="text-lg">{patient.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-lg break-all">{patient.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prescription Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Prescription Details
                </CardTitle>
                <CardDescription>Fill in the prescription information below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Enter the diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                      className="min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicine">Medicine</Label>
                    <Input
                      id="medicine"
                      type="text"
                      placeholder="Enter the medicine name"
                      value={formData.medicine}
                      onChange={(e) => handleInputChange("medicine", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        type="text"
                        placeholder="e.g., 500mg"
                        value={formData.dosage}
                        onChange={(e) => handleInputChange("dosage", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input
                        id="frequency"
                        type="text"
                        placeholder="e.g., 2 times a day"
                        value={formData.frequency}
                        onChange={(e) => handleInputChange("frequency", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Prescription...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Create Prescription
                        </>
                      )}
                    </Button>
                    <Link href="/">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
