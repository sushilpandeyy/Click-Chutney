"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Check, Sparkles, Code, Rocket, ExternalLink, Download } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface SetupCompleteStepProps {
  data: ProjectData
  onPrev: () => void
}

export function SetupCompleteStep({ data, onPrev }: SetupCompleteStepProps) {
  const [copiedScript, setCopiedScript] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const trackingScript = `<!-- ClickChutney Analytics -->
<script>
  (function(c,h,u,t,n,e,y){
    c[n]=c[n]||function(){(c[n].q=c[n].q||[]).push(arguments)};
    c[n].config={id:'${data.trackingId}'};
    e=h.createElement(u);e.async=1;e.src='https://analytics.clickchutney.com/script.js';
    y=h.getElementsByTagName(u)[0];y.parentNode.insertBefore(e,y);
  })(window,document,'script','cc','chutney');
  
  chutney('init', '${data.trackingId}');
</script>`

  const copyScript = async () => {
    await navigator.clipboard.writeText(trackingScript)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  const handleCreateProject = async () => {
    setIsCreating(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const project = await response.json()
        window.location.href = `/dashboard`
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">You're all set! 🎉</h2>
        <p className="text-muted-foreground">Your project is ready. Add the tracking script to start collecting data.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">Project Created Successfully</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300">Name:</span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">{data.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300">Domain:</span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">{data.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300">Tracking ID:</span>
                    <Badge variant="outline" className="text-xs font-mono">{data.trackingId}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Installation Script</h3>
              <Badge variant="secondary">Required</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add this script to the &lt;head&gt; section of every page you want to track:
            </p>
            <div className="bg-muted rounded-lg p-4 relative">
              <pre className="text-xs font-mono text-wrap overflow-x-auto">{trackingScript}</pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyScript}
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Place this script as high as possible in the &lt;head&gt; for better tracking accuracy.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">WordPress Plugin</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Install our WordPress plugin for easy setup
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <ExternalLink className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">Framework Guides</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Integration guides for React, Vue, and more
              </p>
              <Button variant="outline" size="sm" disabled>
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleCreateProject}
          disabled={isCreating}
          className="px-8"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating Project...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Create Project & Go to Dashboard
            </>
          )}
        </Button>
      </div>
    </div>
  )
}