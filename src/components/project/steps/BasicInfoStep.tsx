"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, ArrowRight, Sparkles, ExternalLink } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface BasicInfoStepProps {
  data: ProjectData
  updateData: (data: Partial<ProjectData>) => void
  onNext: () => void
}

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    url: data.url || "",
    description: data.description || ""
  })
  const [isValidating, setIsValidating] = useState(false)
  const [urlStatus, setUrlStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle")

  const extractDomain = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return ""
    }
  }

  const validateUrl = async (url: string) => {
    if (!url) {
      setUrlStatus("idle")
      return
    }

    setUrlStatus("checking")
    setIsValidating(true)

    try {
      const testUrl = url.startsWith('http') ? url : `https://${url}`
      new URL(testUrl)
      
      setTimeout(() => {
        setUrlStatus("valid")
        setIsValidating(false)
        const domain = extractDomain(url)
        updateData({ 
          url: testUrl, 
          domain,
          name: formData.name || domain
        })
      }, 1000)
    } catch {
      setUrlStatus("invalid")
      setIsValidating(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === "url") {
      validateUrl(value)
    } else {
      updateData({ [field]: value })
    }
  }

  const canProceed = formData.name && urlStatus === "valid"

  const handleNext = () => {
    updateData(formData)
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tell us about your project</h2>
        <p className="text-muted-foreground">We'll help you get started with analytics tracking</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
          <div className="relative">
            <Input
              id="url"
              type="url"
              placeholder="yourwebsite.com or https://yourwebsite.com"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className={`pr-10 ${
                urlStatus === "valid" ? "border-green-500" : 
                urlStatus === "invalid" ? "border-red-500" : ""
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {urlStatus === "checking" && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              {urlStatus === "valid" && (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {urlStatus === "invalid" && (
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✗</span>
                </div>
              )}
            </div>
          </div>
          {urlStatus === "invalid" && (
            <p className="text-xs text-red-500">Please enter a valid URL</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
          <Input
            id="name"
            placeholder="My Awesome Website"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">This will appear in your dashboard</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Brief description of your project"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        {urlStatus === "valid" && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Great! We found your website
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    Domain: {extractDomain(formData.url)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!canProceed}
          className="px-6"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}