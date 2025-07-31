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
  const [isCreating, setIsCreating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)

  // Generate trackingId only once and save it immediately
  useEffect(() => {
    if (!data.trackingId) {
      const newTrackingId = `cc_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`
      updateData({ trackingId: newTrackingId })
    }
  }, [data.trackingId, updateData])

  const trackingId = data.trackingId || 'cc_loading...'
  const scriptTag = `<script src="https://unpkg.com/@click-chutney/analytics@1.2.2/dist/clickchutney.min.js"></script>
<script>cc('init', '${trackingId}');</script>`

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      const projectPayload = {
        name: data.name,
        url: data.url,
        domain: data.domain,
        description: data.description || null,
        trackingId: data.trackingId
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectPayload),
      })
      
      if (response.ok) {
        const project = await response.json()
        updateData({ projectId: project.id })
        setProjectId(project.id)
        setVerificationMessage('Project created! Now install the tracking code and verify your website.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      setVerificationMessage(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setVerificationStatus('error')
    } finally {
      setIsCreating(false)
    }
  }

  const handleVerifyWebsite = async () => {
    if (!projectId && !data.projectId) {
      setVerificationMessage('Please create the project first')
      setVerificationStatus('error')
      return
    }

    const idToUse = projectId || data.projectId
    setIsVerifying(true)
    setVerificationStatus('idle')
    
    try {
      const response = await fetch(`/api/projects/${idToUse}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const result = await response.json()
      
      if (result.success && result.verified) {
        setVerificationStatus('success')
        setVerificationMessage(result.message)
        // Allow user to continue to next step after successful verification
        setTimeout(() => {
          onNext()
        }, 2000)
      } else {
        setVerificationStatus('error')
        setVerificationMessage(result.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Error verifying website:', error)
      setVerificationStatus('error')
      setVerificationMessage(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleContinue = () => {
    if (verificationStatus === 'success') {
      onNext()
    }
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

// Track page views (automatic in many frameworks)
ClickChutney.page();

// Track custom events
ClickChutney.track('button_click', { 
  button: 'signup' 
});`}
                      </pre>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> If you use the npm package and call <code>ClickChutney.init()</code>, you don't need the script tags below. Either method works for verification.
                      </p>
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
                  For WordPress, HTML websites, or any platform that supports custom scripts. Use this if you can't install npm packages.
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

        {/* Verification Process */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Verification Required</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Follow these steps to verify your website and start tracking analytics:
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-blue-950/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Create Project</p>
                  <p className="text-xs text-muted-foreground">Generate your tracking ID and create the project</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleCreateProject} 
                  disabled={isCreating || projectId || data.projectId}
                  variant={projectId || data.projectId ? "outline" : "default"}
                >
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : projectId || data.projectId ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-blue-950/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Install Tracking Code</p>
                  <p className="text-xs text-muted-foreground">Add the code above to your website</p>
                </div>
                <div className="text-xs text-muted-foreground">Manual Step</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-blue-950/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Verify Installation</p>
                  <p className="text-xs text-muted-foreground">Check if tracking code is properly installed</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleVerifyWebsite} 
                  disabled={isVerifying || !projectId && !data.projectId || verificationStatus === 'success'}
                  variant={verificationStatus === 'success' ? "outline" : "default"}
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : verificationStatus === 'success' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </div>

            {verificationMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                verificationStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                verificationStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
              }`}>
                {verificationMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleContinue} 
          disabled={verificationStatus !== 'success'}
          className={verificationStatus === 'success' ? '' : 'opacity-50 cursor-not-allowed'}
        >
          {verificationStatus === 'success' ? (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Verify Website First
              <Shield className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}