"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Shield, Copy, Check, AlertCircle, Globe, Code } from "lucide-react"
import type { ProjectData } from "../ProjectWizard"

interface WebsiteVerificationStepProps {
  data: ProjectData
  updateData: (data: Partial<ProjectData>) => void
  onNext: () => void
  onPrev: () => void
}

export function WebsiteVerificationStep({ data, updateData, onNext, onPrev }: WebsiteVerificationStepProps) {
  const [verificationMethod, setVerificationMethod] = useState<"meta" | "file" | "dns">("meta")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [copiedMeta, setCopiedMeta] = useState(false)
  const [copiedFile, setCopiedFile] = useState(false)

  const trackingId = `cc_${Math.random().toString(36).substr(2, 16)}`
  const metaTag = `<meta name="clickchutney-verification" content="${trackingId}" />`
  const verificationFile = `clickchutney-verification.txt`
  const fileContent = trackingId
  const dnsRecord = `TXT clickchutney-verification ${trackingId}`

  const copyToClipboard = async (text: string, type: "meta" | "file") => {
    await navigator.clipboard.writeText(text)
    if (type === "meta") {
      setCopiedMeta(true)
      setTimeout(() => setCopiedMeta(false), 2000)
    } else {
      setCopiedFile(true)
      setTimeout(() => setCopiedFile(false), 2000)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      updateData({ trackingId })
    }, 2000)
  }

  const handleNext = () => {
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify your website</h2>
        <p className="text-muted-foreground">Choose a verification method to prove you own {data.domain}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            className={`cursor-pointer transition-all ${
              verificationMethod === "meta" ? "border-primary bg-primary/5" : "hover:border-border"
            }`}
            onClick={() => setVerificationMethod("meta")}
          >
            <CardContent className="p-4 text-center">
              <Code className="w-6 h-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">HTML Meta Tag</h3>
              <p className="text-xs text-muted-foreground mt-1">Recommended</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              verificationMethod === "file" ? "border-primary bg-primary/5" : "hover:border-border"
            }`}
            onClick={() => setVerificationMethod("file")}
          >
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">File Upload</h3>
              <p className="text-xs text-muted-foreground mt-1">Alternative</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              verificationMethod === "dns" ? "border-primary bg-primary/5" : "hover:border-border"
            }`}
            onClick={() => setVerificationMethod("dns")}
          >
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">DNS Record</h3>
              <p className="text-xs text-muted-foreground mt-1">Advanced</p>
            </CardContent>
          </Card>
        </div>

        {verificationMethod === "meta" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="font-medium">HTML Meta Tag Verification</h3>
                <Badge variant="secondary">Recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Add this meta tag to the &lt;head&gt; section of your website's homepage:
              </p>
              <div className="bg-muted rounded-lg p-4 relative">
                <code className="text-sm font-mono break-all">{metaTag}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(metaTag, "meta")}
                >
                  {copiedMeta ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationMethod === "file" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-medium">File Upload Verification</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create a file named <code className="bg-muted px-1 rounded">{verificationFile}</code> with the following content and upload it to your website's root directory:
              </p>
              <div className="bg-muted rounded-lg p-4 relative mb-4">
                <code className="text-sm font-mono">{fileContent}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(fileContent, "file")}
                >
                  {copiedFile ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The file should be accessible at: <code className="bg-muted px-1 rounded">{data.url}/{verificationFile}</code>
              </p>
            </CardContent>
          </Card>
        )}

        {verificationMethod === "dns" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-medium">DNS Record Verification</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Add this TXT record to your domain's DNS settings:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <code className="text-sm font-mono">{dnsRecord}</code>
              </div>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    DNS changes can take up to 24 hours to propagate. We recommend using the HTML meta tag for faster verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isVerified && (
          <div className="text-center">
            <Button 
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-8"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Domain
                </>
              )}
            </Button>
          </div>
        )}

        {isVerified && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Domain Verified Successfully!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Your website {data.domain} has been verified and is ready for tracking.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {isVerified && (
          <Button onClick={handleNext}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}