#!/usr/bin/env node

console.log('🔍 Environment Variables Check\n')

const requiredEnvVars = [
  'DATABASE_URL',
  'AUTH_GITHUB_ID',
  'AUTH_GITHUB_SECRET',
  'BETTER_AUTH_SECRET',
  'NEXTAUTH_URL'
]

const optionalEnvVars = [
  'DATABASE_NAME',
  'NEXT_PUBLIC_BASE_URL'
]

let allRequired = true

console.log('✅ Required Environment Variables:')
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  const status = value ? '✅' : '❌'
  const displayValue = value 
    ? (envVar.includes('SECRET') || envVar.includes('URL') ? 'present' : value.slice(0, 20) + '...')
    : 'missing'
  
  console.log(`${status} ${envVar}: ${displayValue}`)
  if (!value) allRequired = false
})

console.log('\n📋 Optional Environment Variables:')
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  const status = value ? '✅' : '⚪'
  const displayValue = value 
    ? (envVar.includes('SECRET') || envVar.includes('URL') ? 'present' : value.slice(0, 20) + '...')
    : 'not set'
  
  console.log(`${status} ${envVar}: ${displayValue}`)
})

console.log('\n🏗️ Build Environment:')
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV || 'not set'}`)
console.log(`NEXT_PHASE: ${process.env.NEXT_PHASE || 'not set'}`)

console.log('\n' + '='.repeat(50))
if (allRequired) {
  console.log('✅ All required environment variables are set!')
} else {
  console.log('❌ Some required environment variables are missing!')
  console.log('\nFor Vercel deployment, make sure to set these in:')
  console.log('Project Settings → Environment Variables')
}