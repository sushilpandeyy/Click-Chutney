'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import ClickChutney from '@click-chutney/analytics'

interface ClickChutneyContextType {
  track: (event: string, properties?: Record<string, any>) => void
  page: (url?: string, title?: string) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  set: (properties: Record<string, any>) => void
}

const ClickChutneyContext = createContext<ClickChutneyContextType | null>(null)

interface ClickChutneyProviderProps {
  children: ReactNode
  trackingId?: string
  debug?: boolean
  autoTrack?: boolean
}

export function ClickChutneyProvider({
  children,
  trackingId,
  debug = false,
  autoTrack = true
}: ClickChutneyProviderProps) {
  useEffect(() => {
    // Get tracking ID from environment if not provided
    const finalTrackingId = trackingId || 
      process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID ||
      process.env.CLICKCHUTNEY_TRACKING_ID

    if (!finalTrackingId) {
      console.warn('ClickChutney: No tracking ID provided. Set NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID or pass trackingId prop.')
      return
    }

    // Initialize ClickChutney
    ClickChutney.init(finalTrackingId, {
      debug,
      autoTrack
    })
  }, [trackingId, debug, autoTrack])

  const contextValue: ClickChutneyContextType = {
    track: ClickChutney.track.bind(ClickChutney),
    page: ClickChutney.page.bind(ClickChutney),
    identify: ClickChutney.identify.bind(ClickChutney),
    set: ClickChutney.set.bind(ClickChutney)
  }

  return (
    <ClickChutneyContext.Provider value={contextValue}>
      {children}
    </ClickChutneyContext.Provider>
  )
}

export function useClickChutney(): ClickChutneyContextType {
  const context = useContext(ClickChutneyContext)
  if (!context) {
    throw new Error('useClickChutney must be used within ClickChutneyProvider')
  }
  return context
}