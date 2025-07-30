"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Globe, Palette, Rocket, Settings, Sparkles } from "lucide-react"
import { ProjectWizard } from "@/components/project/ProjectWizard"

export default function NewProject() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Project</h1>
            <p className="text-sm text-muted-foreground">Set up analytics for your website</p>
          </div>
        </div>

        <ProjectWizard />
      </div>
    </div>
  )
}