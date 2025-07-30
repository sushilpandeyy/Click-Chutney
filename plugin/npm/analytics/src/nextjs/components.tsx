'use client'

import React from 'react'
import { useClickChutney } from './provider'

interface TrackingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  eventName?: string
  eventProperties?: Record<string, any>
}

export function TrackingButton({
  eventName = 'button_click',
  eventProperties = {},
  onClick,
  children,
  ...props
}: TrackingButtonProps) {
  const { track } = useClickChutney()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click
    track(eventName, {
      ...eventProperties,
      button_text: typeof children === 'string' ? children : 'button',
      timestamp: new Date().toISOString()
    })

    // Call original onClick if provided
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

interface TrackingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName?: string
  eventProperties?: Record<string, any>
}

export function TrackingLink({
  eventName = 'link_click',
  eventProperties = {},
  onClick,
  children,
  href,
  ...props
}: TrackingLinkProps) {
  const { track } = useClickChutney()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Track the click
    track(eventName, {
      ...eventProperties,
      link_url: href,
      link_text: typeof children === 'string' ? children : 'link',
      timestamp: new Date().toISOString()
    })

    // Call original onClick if provided
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

interface TrackingFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  eventName?: string
  eventProperties?: Record<string, any>
}

export function TrackingForm({
  eventName = 'form_submit',
  eventProperties = {},
  onSubmit,
  children,
  ...props
}: TrackingFormProps) {
  const { track } = useClickChutney()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Track the form submission
    track(eventName, {
      ...eventProperties,
      form_id: props.id,
      form_name: props.name,
      timestamp: new Date().toISOString()
    })

    // Call original onSubmit if provided
    if (onSubmit) {
      onSubmit(event)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  )
}