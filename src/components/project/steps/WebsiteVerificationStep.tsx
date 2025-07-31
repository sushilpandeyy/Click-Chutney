"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, Shield, Copy, Check, Code, Globe, CheckCircle2 } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface WebsiteVerificationStepProps {
  data: ProjectData
  updateData: (data: Partial<ProjectData>) => void
  onNext: () => void
  onPrev: () => void
}

export function WebsiteVerificationStep({ data, updateData, onNext, onPrev }: WebsiteVerificationStepProps) {
  const [copiedScript, setCopiedScript] = useState(false)
  const [activeTab, setActiveTab] = useState('nextjs')

  // Generate trackingId only once or use existing one
  const trackingId = data.trackingId || `cc_${Math.random().toString(36).substr(2, 16)}`
  const scriptTag = `<script src="https://unpkg.com/@click-chutney/analytics@1.2.2/dist/clickchutney.min.js"></script>
<script>cc('init', '${trackingId}');</script>`

  // Save trackingId to data when component mounts if it doesn't exist
  useEffect(() => {
    if (!data.trackingId) {
      updateData({ trackingId })
    }
  }, [data.trackingId, trackingId, updateData])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  const handleContinue = () => {
    updateData({ trackingId })
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Install ClickChutney</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add ClickChutney to <strong>{data.domain}</strong> and start tracking visitors automatically
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nextjs" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              React/Next.js
            </TabsTrigger>
            <TabsTrigger value="vanilla" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              HTML/WordPress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nextjs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  React/Next.js Integration (Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Install our unified analytics package for React and Next.js applications.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">1. Install the package</h4>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <code className="text-sm font-mono">npm install @click-chutney/analytics</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard('npm install @click-chutney/analytics')}
                      >
                        {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">2. Initialize in your app</h4>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-xs font-mono text-wrap">
{`// app/layout.tsx or _app.tsx
import ClickChutney from '@click-chutney/analytics';

// Initialize with your tracking ID
ClickChutney.init('${trackingId}');

// Track page views
ClickChutney.page();

// Track custom events
ClickChutney.track('button_click', { 
  button: 'signup' 
});`}
                      </pre>
                    </div>
                  </div>

                </div>

                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <strong>That's it!</strong> Analytics will start working immediately when visitors land on your site.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vanilla" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  HTML/WordPress/Vanilla JS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  For WordPress, HTML websites, or any platform that supports custom scripts.
                </p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Add this code to your website</h4>
                  <div className="bg-muted rounded-lg p-4 relative">
                    <pre className="text-xs font-mono text-wrap break-all">{scriptTag}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(scriptTag)}
                    >
                      {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Add this to your &lt;head&gt; section</p>
                </div>

                <Alert className="mt-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <strong>That's it!</strong> Analytics will start working immediately when visitors land on your site.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Simple Setup Complete */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Ready to Track!</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Once you add the code to your website, ClickChutney will automatically start tracking page views and visitor data.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button onClick={handleContinue}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}