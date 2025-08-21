'use client';

import { useMemo } from 'react';

interface ChartDataPoint {
  timestamp: string;
  pageviews: number;
  events: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  metric?: 'pageviews' | 'events';
  height?: number;
  className?: string;
}

export function AnalyticsChart({ 
  data, 
  type = 'line', 
  metric = 'pageviews', 
  height = 200,
  className = '' 
}: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, normalizedData: [] };
    }

    const values = data.map(d => d[metric]);
    const maxValue = Math.max(...values);
    const normalizedData = data.map((item, index) => ({
      ...item,
      x: (index / (data.length - 1)) * 100,
      y: maxValue > 0 ? ((maxValue - item[metric]) / maxValue) * 100 : 0,
      value: item[metric]
    }));

    return { maxValue, normalizedData };
  }, [data, metric]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: data.length <= 24 ? 'numeric' : undefined
    });
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-card border border-border rounded-lg p-6 ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const { maxValue, normalizedData } = chartData;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-card-foreground capitalize">
            {metric === 'pageviews' ? 'Page Views' : 'Events'} Trend
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.length} data points • Max: {formatValue(maxValue)}
          </p>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(var(--border))" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Chart content */}
          {type === 'line' ? (
            <>
              {/* Area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(var(--chart-1))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(var(--chart-1))" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {normalizedData.length > 1 && normalizedData[0] && normalizedData[normalizedData.length - 1] && (
                <>
                  <path
                    d={`M ${normalizedData[0]?.x}% ${normalizedData[0]?.y}% ${normalizedData.slice(1).map(d => `L ${d?.x}% ${d?.y}%`).join(' ')} L ${normalizedData[normalizedData.length - 1]?.x}% 100% L ${normalizedData[0]?.x}% 100% Z`}
                    fill="url(#areaGradient)"
                  />
                  <path
                    d={`M ${normalizedData[0]?.x}% ${normalizedData[0]?.y}% ${normalizedData.slice(1).map(d => `L ${d?.x}% ${d?.y}%`).join(' ')}`}
                    fill="none"
                    stroke="rgb(var(--chart-1))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
              
              {/* Data points */}
              {normalizedData.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={`${point.x}%`}
                    cy={`${point.y}%`}
                    r="3"
                    fill="rgb(var(--chart-1))"
                    className="hover:r-5 transition-all cursor-pointer"
                  >
                    <title>{`${formatDate(point.timestamp)}: ${formatValue(point.value)}`}</title>
                  </circle>
                </g>
              ))}
            </>
          ) : (
            /* Bar chart */
            normalizedData.map((point, index) => (
              <g key={index}>
                <rect
                  x={`${point.x - 1.5}%`}
                  y={`${point.y}%`}
                  width="3%"
                  height={`${100 - point.y}%`}
                  fill="rgb(var(--chart-1))"
                  opacity="0.7"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{`${formatDate(point.timestamp)}: ${formatValue(point.value)}`}</title>
                </rect>
              </g>
            ))
          )}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground mt-2">
          {normalizedData.length > 0 && normalizedData[0] && normalizedData[normalizedData.length - 1] && (
            <>
              <span>{formatDate(normalizedData[0].timestamp)}</span>
              {normalizedData.length > 2 && (
                <span>{formatDate(normalizedData[Math.floor(normalizedData.length / 2)]?.timestamp || '')}</span>
              )}
              <span>{formatDate(normalizedData[normalizedData.length - 1]?.timestamp || '')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}