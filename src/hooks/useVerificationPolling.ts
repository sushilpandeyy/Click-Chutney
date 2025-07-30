"use client"

import { useState, useEffect, useCallback } from "react"

interface UseVerificationPollingProps {
  trackingId: string
  domain: string
  isVerified: boolean
  enabled?: boolean
  interval?: number
}

interface VerificationResult {
  verified: boolean
  error?: string
}

export function useVerificationPolling({
  trackingId,
  domain,
  isVerified,
  enabled = true,
  interval = 30000 // 30 seconds
}: UseVerificationPollingProps) {
  const [polling, setPolling] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const checkVerification = useCallback(async () => {
    if (isVerified || !enabled) return

    setPolling(true)
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId, domain })
      })

      const data = await response.json()
      setResult({
        verified: response.ok && data.verified,
        error: response.ok ? undefined : data.error
      })
      setLastChecked(new Date())
    } catch (error) {
      setResult({
        verified: false,
        error: 'Network error occurred'
      })
    } finally {
      setPolling(false)
    }
  }, [trackingId, domain, isVerified, enabled])

  useEffect(() => {
    if (!enabled || isVerified) return

    // Initial check
    checkVerification()

    // Set up polling
    const intervalId = setInterval(checkVerification, interval)

    return () => clearInterval(intervalId)
  }, [checkVerification, enabled, isVerified, interval])

  return {
    polling,
    lastChecked,
    result,
    checkNow: checkVerification
  }
}