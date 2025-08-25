'use client';

import { ClickChutneyProvider } from './clickchutney-provider';

interface AnalyticsWrapperProps {
  trackingId: string;
  children: React.ReactNode;
}

export function AnalyticsWrapper({ trackingId, children }: AnalyticsWrapperProps) {
  return (
    <ClickChutneyProvider trackingId={trackingId}>
      {children}
    </ClickChutneyProvider>
  );
}