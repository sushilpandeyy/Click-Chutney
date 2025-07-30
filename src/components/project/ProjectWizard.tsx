"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Check, Globe, Palette, Code, Sparkles } from "lucide-react"
import { StepIndicator } from "./StepIndicator"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { WebsiteVerificationStep } from "./steps/WebsiteVerificationStep"
import { CustomizationStep } from "./steps/CustomizationStep"
import { SetupCompleteStep } from "./steps/SetupCompleteStep"

export interface ProjectData {
  name: string
  url: string
  domain: string
  description: string
  favicon?: string
  color: string
  trackingId?: string
}

const steps = [
  { id: 1, title: "Basic Info", icon: Globe, description: "Tell us about your project" },
  { id: 2, title: "Verification", icon: Check, description: "Verify domain ownership" },
  { id: 3, title: "Customize", icon: Palette, description: "Personalize your dashboard" },  
  { id: 4, title: "Complete", icon: Sparkles, description: "Your project is ready!" }
]

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    url: "",
    domain: "",
    description: "",
    color: "#F59E0B"
  })

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={projectData} updateData={updateProjectData} onNext={nextStep} />
      case 2:
        return <WebsiteVerificationStep data={projectData} updateData={updateProjectData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <CustomizationStep data={projectData} updateData={updateProjectData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <SetupCompleteStep data={projectData} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <Card className="mt-8">
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  )
}