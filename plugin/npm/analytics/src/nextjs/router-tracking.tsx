'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useClickChutney } from './provider'

export function RouterTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { page } = useClickChutney()

  useEffect(() => {
    // Track route changes with small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      const title = typeof document !== 'undefined' ? document.title : undefined
      page(url, title)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname, searchParams, page])

  return null
}

// HOC for automatic page tracking
export function withClickChutney<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithClickChutneyComponent = (props: P) => {
    return (
      <>
        <RouterTracking />
        <WrappedComponent {...props} />
      </>
    )
  }

  WithClickChutneyComponent.displayName = `withClickChutney(${WrappedComponent.displayName || WrappedComponent.name})`

  return WithClickChutneyComponent
}