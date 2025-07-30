"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Copy, 
  Check,
  ExternalLink,
  Code,
  Globe
} from "lucide-react"

interface Project {
  id: string
  name: string
  domain: string
  url: string
  trackingId: string
  isVerified: boolean
  verifiedAt?: string
  createdAt: string
}

interface ProjectStatusProps {
  project: Project
  onVerificationUpdate?: () => void
}

export function ProjectStatus({ project, onVerificationUpdate }: ProjectStatusProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [copiedTag, setCopiedTag] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)
  const [error, setError] = useState<string>('')

  const metaTag = `<meta name="clickchutney-verification" content="${project.trackingId}" />`
  const scriptTag = `<script src="https://cdn.clickchutney.com/v1/analytics.js" data-site-id="${project.trackingId}" async></script>`

  const copyToClipboard = async (text: string, type: 'tag' | 'script') => {
    await navigator.clipboard.writeText(text)
    if (type === 'tag') {
      setCopiedTag(true)
      setTimeout(() => setCopiedTag(false), 2000)
    } else {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    }
  }

  const verifyDomain = async () => {
    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId: project.trackingId,
          domain: project.domain
        })
      })

      const result = await response.json()

      if (response.ok && result.verified) {
        onVerificationUpdate?.()
      } else {
        setError(result.error || 'Verification failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {project.name}
            </CardTitle>
            <Badge variant={project.isVerified ? "default" : "secondary"}>
              {project.isVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Domain:</span>
              <p className="font-medium">{project.domain}</p>
            </div>
            <div>
              <span className="text-muted-foreground">URL:</span>
              <p className="font-medium flex items-center gap-1">
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.url}
                </a>
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Tracking ID:</span>
              <p className="font-mono text-xs">{project.trackingId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {project.isVerified && project.verifiedAt && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                Domain verified on {new Date(project.verifiedAt).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Verification Setup */}
      {!project.isVerified && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Shield className="w-5 h-5" />
              Domain Verification Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Add one of the following to your website to verify domain ownership:
            </p>

            {/* Meta Tag Option */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Code className="w-4 h-4" />
                Option 1: Verification Meta Tag
              </h4>
              <div className="bg-muted rounded-lg p-3 relative">
                <code className="text-xs font-mono break-all">{metaTag}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => copyToClipboard(metaTag, 'tag')}
                >
                  {copiedTag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this to the &lt;head&gt; section of your homepage
              </p>
            </div>

            {/* Script Tag Option */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Option 2: Analytics Script (Recommended)
              </h4>
              <div className="bg-muted rounded-lg p-3 relative">
                <code className="text-xs font-mono break-all">{scriptTag}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => copyToClipboard(scriptTag, 'script')}
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this before &lt;/body&gt; to start tracking immediately
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={verifyDomain} 
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Domain
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analytics Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Analytics Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.isVerified ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span>Ready to receive analytics data</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" />
              <span>Waiting for domain verification</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}