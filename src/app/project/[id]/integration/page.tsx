"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Code, 
  Copy,
  Check,
  Globe,
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project/ProjectSidebar"

export default function ProjectIntegrationPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedScript, setCopiedScript] = useState(false)
  const [copiedEnv, setCopiedEnv] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'script' | 'env') => {
    await navigator.clipboard.writeText(text)
    if (type === 'script') {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    } else {
      setCopiedEnv(true)
      setTimeout(() => setCopiedEnv(false), 2000)
    }
  }

  const handleVerifyWebsite = async () => {
    setIsVerifying(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/verify`, {
        method: 'POST'
      })
      const result = await response.json()
      if (result.success) {
        setProject({ ...project, isVerified: result.verified })
      }
    } catch (error) {
      console.error('Error verifying website:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const trackingId = project.trackingId
  const scriptTag = `<script src="https://unpkg.com/@click-chutney/analytics@2.0.9/dist/clickchutney.min.js"></script>
<script>cc('init', '${trackingId}');</script>`

  const envVariable = `NEXT_PUBLIC_CLICKCHUTNEY_ID=${trackingId}`

  const reactComponent = `// app/layout.tsx (Next.js 13+)
import { Analytics } from '@click-chutney/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}`

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <ProjectSidebar 
          currentPage="integration"
          projectName={project.name}
          projectDomain={project.domain}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="font-semibold">Integration Setup</h1>
                <p className="text-sm text-muted-foreground">Add ClickChutney Analytics to your website</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6">
            {/* Status Card */}
            <Card className={project.isVerified ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {project.isVerified ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {project.isVerified ? "Integration Active" : "Integration Pending"}
                    </h3>
                    <p className="text-sm opacity-80">
                      {project.isVerified 
                        ? `ClickChutney is successfully tracking events from ${project.domain}`
                        : `Install the tracking code on ${project.domain} and verify integration`
                      }
                    </p>
                  </div>
                  {!project.isVerified && (
                    <Button onClick={handleVerifyWebsite} disabled={isVerifying}>
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Verify Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Integration Instructions */}
            <Tabs defaultValue="nextjs" className="w-full">
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
                    <p className="text-sm text-muted-foreground">
                      Zero-configuration setup for React and Next.js applications. Works with App Router, Pages Router, and all React frameworks.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-sm mb-2">1. Install the package</h4>
                      <div className="bg-muted rounded-lg p-4 relative">
                        <code className="text-sm font-mono">npm install @click-chutney/analytics</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard('npm install @click-chutney/analytics', 'script')}
                        >
                          {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">2. Add environment variable</h4>
                      <div className="bg-muted rounded-lg p-4 relative">
                        <code className="text-sm font-mono">{envVariable}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(envVariable, 'env')}
                        >
                          {copiedEnv ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Add this to your .env.local file</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">3. Add Analytics component</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <pre className="text-xs font-mono text-wrap">{reactComponent}</pre>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertDescription>
                          <strong>That's it!</strong> Analytics will automatically start tracking when visitors land on your site.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">What gets tracked automatically:</h5>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Page views and route changes</li>
                          <li>• Button and link clicks</li>
                          <li>• Form submissions</li>
                          <li>• Performance metrics (load time, FCP, LCP)</li>
                          <li>• Session duration and user behavior</li>
                        </ul>
                      </div>
                    </div>
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
                    <p className="text-sm text-muted-foreground">
                      For WordPress, HTML websites, or any platform that supports custom scripts
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Add this code to your website</h4>
                      <div className="bg-muted rounded-lg p-4 relative">
                        <pre className="text-xs font-mono text-wrap break-all">{scriptTag}</pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(scriptTag, 'script')}
                        >
                          {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Add this to your &lt;head&gt; section</p>
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
            </Tabs>

            {/* Custom Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Custom Event Tracking
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track specific user actions beyond automatic tracking
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">React/Next.js Hook Usage</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-xs font-mono text-wrap">{`import { useAnalytics } from '@click-chutney/analytics/react';

function MyComponent() {
  const analytics = useAnalytics();
  
  const handleSignup = () => {
    analytics.track('signup_clicked', {
      plan: 'premium',
      source: 'pricing_page'
    });
  };
  
  const handlePurchase = (amount) => {
    analytics.track('purchase_completed', {
      amount: amount,
      currency: 'USD',
      items: 1
    });
  };
  
  return (
    <div>
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={() => handlePurchase(99)}>Buy Now</button>
    </div>
  );
}`}</pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">HTML/JavaScript Usage</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-xs font-mono text-wrap">{`<!-- After your analytics script -->
<script>
// Track button clicks
function trackSignup() {
  cc('track', 'signup_clicked', {
    plan: 'premium',
    source: 'homepage'
  });
}

// Track purchases
function trackPurchase(amount) {
  cc('track', 'purchase_completed', {
    amount: amount,
    currency: 'USD'
  });
}

// Identify users (optional)
function identifyUser(userId, email) {
  cc('identify', userId, {
    email: email,
    subscription: 'premium'
  });
}
</script>

<!-- Add to your buttons -->
<button onclick="trackSignup()">Sign Up</button>
<button onclick="trackPurchase(99)">Buy Now $99</button>`}</pre>
                  </div>
                </div>
                
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Custom events appear in your dashboard within seconds and help you understand user behavior patterns.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracking ID:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{trackingId}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain:</span>
                        <span>{project.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={project.isVerified ? "default" : "secondary"}>
                          {project.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">What We Track</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Page views and navigation</li>
                      <li>• Button and link clicks</li>
                      <li>• Form submissions</li>
                      <li>• User sessions and behavior</li>
                      <li>• Performance metrics (load time, FCP, LCP)</li>
                      <li>• Geographic data (anonymous, IP-based)</li>
                      <li>• Session duration and user flow</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Troubleshooting Section */}
            {!project.isVerified && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="w-5 h-5" />
                    Troubleshooting
                  </CardTitle>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Having issues with verification? Here's how to debug.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Browser Console Check</h4>
                      <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                        <li>Open your website in a browser</li>
                        <li>Press F12 to open developer tools</li>
                        <li>Go to the Console tab</li>
                        <li>Look for: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-xs">✅ ClickChutney: Initialized successfully</code></li>
                        <li>Visit a few pages to generate events</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Network Tab Check</h4>
                      <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                        <li>In dev tools, go to Network tab</li>
                        <li>Visit your website pages</li>
                        <li>Look for POST requests to <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-xs">/api/analytics</code></li>
                        <li>Check if requests return 200 OK status</li>
                        <li>Wait 1-2 minutes, then try verification</li>
                      </ol>
                    </div>
                  </div>
                  
                  <Alert>
                    <CheckCircle2 className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Still having issues?</strong> The verification process checks for events from <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{project.domain}</code> specifically. Make sure you're testing on the exact domain you registered.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}