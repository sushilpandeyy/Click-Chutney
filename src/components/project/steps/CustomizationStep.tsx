"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Palette, Eye, BarChart3, TrendingUp } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface CustomizationStepProps {
  data: ProjectData
  updateData: (data: Partial<ProjectData>) => void
  onNext: () => void
  onPrev: () => void
}

const colorPresets = [
  { name: "Mango", value: "#F59E0B", bg: "bg-yellow-500" },
  { name: "Chili", value: "#EF4444", bg: "bg-red-500" },
  { name: "Mint", value: "#10B981", bg: "bg-green-500" },
  { name: "Ocean", value: "#3B82F6", bg: "bg-blue-500" },
  { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
  { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
]

export function CustomizationStep({ data, updateData, onNext, onPrev }: CustomizationStepProps) {
  const [selectedColor, setSelectedColor] = useState(data.color || "#F59E0B")

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    updateData({ color })
  }

  const handleNext = () => {
    updateData({ color: selectedColor })
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Customize your dashboard</h2>
        <p className="text-muted-foreground">Choose colors and preferences for your analytics dashboard</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Dashboard Theme Color</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all hover:scale-105
                  ${selectedColor === color.value ? "border-primary" : "border-border"}
                `}
              >
                <div className={`w-8 h-8 rounded-full ${color.bg} mx-auto mb-2`} />
                <p className="text-xs font-medium">{color.name}</p>
                {selectedColor === color.value && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Dashboard Preview
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedColor }}>
                  <span className="text-white text-lg flex items-center justify-center w-full h-full">🥭</span>
                </div>
                <div>
                  <h4 className="font-medium">{data.name || "Your Project"}</h4>
                  <p className="text-xs text-muted-foreground">{data.domain}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColor + "20" }}>
                      <BarChart3 className="w-4 h-4 m-1" style={{ color: selectedColor }} />
                    </div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Visits</p>
                  <p className="text-lg font-bold">1,247</p>
                </div>
                
                <div className="bg-background rounded p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColor + "20" }}>
                      <TrendingUp className="w-4 h-4 m-1" style={{ color: selectedColor }} />
                    </div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-lg font-bold">+23%</p>
                </div>
              </div>
              
              <div className="bg-background rounded p-3 border">
                {/* Simple chart representation */}
                <div className="flex items-end gap-1 h-16">
                  {[20, 35, 28, 45, 32, 50, 38].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{ 
                        backgroundColor: selectedColor,
                        height: `${height}%`,
                        opacity: 0.8
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}