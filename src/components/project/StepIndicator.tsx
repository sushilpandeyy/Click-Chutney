"use client"

import { Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Step {
  id: number
  title: string
  icon: LucideIcon
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isCurrent = step.id === currentStep
        const isUpcoming = step.id > currentStep
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center text-center">
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${isCompleted 
                    ? "bg-green-500 border-green-500 text-white" 
                    : isCurrent 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-muted border-border text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2">
                <p className={`text-sm font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-0.5 mx-4 mt-[-20px] transition-all
                  ${step.id < currentStep ? "bg-green-500" : "bg-border"}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}