"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, Shield, Copy, Check, Code, Globe, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface WebsiteVerificationStepProps {
  data: ProjectData
  updateData: (data: Partial<ProjectData>) => void
  onNext: () => void
  onPrev: () => void
}

type VerificationStatus = 'pending' | 'verifying' | 'verified' | 'failed'

export function WebsiteVerificationStep({ data, updateData, onNext, onPrev }: WebsiteVerificationStepProps) {
  const [status, setStatus] = useState<VerificationStatus>('pending')
  const [copiedMeta, setCopiedMeta] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState('nextjs')

  const trackingId = `cc_${Math.random().toString(36).substr(2, 16)}`
  const metaTag = `<meta name="clickchutney-verification" content="${trackingId}" />`
  const scriptTag = `<script src="https://cdn.clickchutney.com/v1/analytics.js" data-site-id="${trackingId}" async></script>`

  const copyToClipboard = async (text: string, type: 'meta' | 'script') => {
    await navigator.clipboard.writeText(text)
    if (type === 'meta') {
      setCopiedMeta(true)
      setTimeout(() => setCopiedMeta(false), 2000)
    } else {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    }
  }

  const verifyDomain = async () => {
    setStatus('verifying')
    setError('')
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          domain: data.domain
        })
      })

      const result = await response.json()
      
      if (response.ok && result.verified) {
        setStatus('verified')
        updateData({ trackingId, isVerified: true })
      } else {
        setStatus('failed')
        setError(result.error || 'Verification failed')
      }
    } catch (err) {
      setStatus('failed')
      setError('Network error occurred')
    }
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
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify your website</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose how you want to implement ClickChutney on <strong>{data.domain}</strong>
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nextjs" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Next.js App
            </TabsTrigger>
            <TabsTrigger value="vanilla" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Other Frameworks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nextjs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Next.js Integration (Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Install our Next.js package for automatic analytics tracking and domain verification.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">1. Install the package</h4>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <code className="text-sm font-mono">npm install @clickchutney/nextjs</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard('npm install @clickchutney/nextjs', 'meta')}
                      >
                        {copiedMeta ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">2. Add environment variable</h4>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <code className="text-sm font-mono">NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID={trackingId}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID=${trackingId}`, 'script')}
                      >
                        {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Add this to your .env.local file</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">3. Wrap your app</h4>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-xs font-mono text-wrap">
{`// app/layout.tsx
import { ClickChutneyProvider } from '@clickchutney/nextjs'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClickChutneyProvider>
          {children}
        </ClickChutneyProvider>
      </body>
    </html>
  )
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <strong>That's it!</strong> Domain verification happens automatically when your app receives its first visitor.
                  </AlertDescription>
                </Alert>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    What you get:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Automatic domain verification on first visit</li>
                    <li>Real-time page view tracking</li>
                    <li>User interaction tracking</li>
                    <li>TypeScript support</li>
                    <li>React 18 compatible</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vanilla" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Other Frameworks & Vanilla JS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  For React, Vue, Svelte, or vanilla JavaScript applications.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">1. Install the core package</h4>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <code className="text-sm font-mono">npm install @clickchutney/analytics</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard('npm install @clickchutney/analytics', 'meta')}
                      >
                        {copiedMeta ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">2. Initialize in your app</h4>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-xs font-mono text-wrap">
{`import ClickChutney from '@clickchutney/analytics'

// Initialize with your tracking ID
ClickChutney.init('${trackingId}')

// Track page views manually
ClickChutney.page()

// Track custom events
ClickChutney.track('button_click', {
  button: 'signup'
})`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">3. Alternative: CDN Script Tag</h4>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <code className="text-sm font-mono break-all text-wrap">{scriptTag}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(scriptTag, 'script')}
                      >
                        {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Add this before closing &lt;/body&gt; tag</p>
                  </div>
                </div>

                <Alert>
                  <Globe className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Framework-specific packages coming soon:</strong> React, Vue, and Svelte integrations are in development.
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Features included:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Automatic domain verification on first event</li>
                    <li>Page view and custom event tracking</li>
                    <li>Session management</li>
                    <li>Performance monitoring</li>
                    <li>TypeScript support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Verification Status */}
        {status !== 'pending' && (
          <Card className={`border-2 ${
            status === 'verified' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
            status === 'verifying' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' :
            'border-red-200 bg-red-50 dark:bg-red-900/20'
          }`}>
            <CardContent className="p-6 text-center">
              {status === 'verifying' && (
                <>
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Verifying Domain...
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Checking if the verification tag is properly installed on {data.domain}
                  </p>
                </>
              )}
              
              {status === 'verified' && (
                <>
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-4 text-green-600" />
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Domain Verified Successfully!
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Your website {data.domain} has been verified and is ready for tracking.
                  </p>
                </>
              )}
              
              {status === 'failed' && (
                <>
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                    {error}
                  </p>
                  <div className="bg-red-100 dark:bg-red-900/50 rounded-lg p-3 text-left">
                    <h4 className="font-medium text-sm mb-2">Troubleshooting:</h4>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Make sure the meta tag is in the &lt;head&gt; section</li>
                      <li>Ensure your website is accessible at {data.url}</li>
                      <li>Wait a few minutes for changes to propagate</li>
                      <li>Check that the tag content exactly matches what's shown above</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          {status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Next Steps:
                </h4>
                <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside text-left">
                  <li>Follow the installation steps above</li>
                  <li>Deploy your application</li>
                  <li>Visit your website to trigger verification</li>
                  <li>Domain will be verified automatically!</li>
                </ol>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex gap-3 justify-center">
              <Button onClick={verifyDomain} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleContinue}>
                Continue Anyway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {status === 'verified' && (
            <Button onClick={handleContinue} size="lg" className="px-8">
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {status === 'pending' && (
          <Button variant="ghost" onClick={handleContinue} className="text-muted-foreground">
            Skip for now
          </Button>
        )}
      </div>
    </div>
  )
}