#!/usr/bin/env node

/**
 * Script to dynamically set DATABASE_URL with correct database name
 * based on environment (dev vs prod)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const baseUrl = process.env.DATABASE_URL;

if (!baseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// Determine database name
let dbName;
if (process.env.DATABASE_NAME) {
  dbName = process.env.DATABASE_NAME;
} else {
  dbName = isProduction ? 'clickchutney_prod' : 'clickchutney_dev';
}

// Build the full URL
let fullUrl;
if (baseUrl.includes('mongodb://') || baseUrl.includes('mongodb+srv://')) {
  // Parse the URL properly
  const url = new URL(baseUrl);
  
  // Check if database name is already in the pathname
  if (url.pathname && url.pathname !== '/' && url.pathname.length > 1) {
    // Database name already in URL
    fullUrl = baseUrl;
  } else {
    // Add database name to URL
    url.pathname = `/${dbName}`;
    fullUrl = url.toString();
  }
} else {
  fullUrl = baseUrl;
}

// Set the environment variable for the current process
process.env.DATABASE_URL = fullUrl;

console.log(`🍛 Database URL set for ${isProduction ? 'production' : 'development'}: ${dbName}`);
console.log(`🔗 Full URL: ${fullUrl}`);