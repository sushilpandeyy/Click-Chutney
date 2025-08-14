# 🚀 ClickChutney Deployment Guide

## Required Environment Variables

### For Vercel Deployment

Set these environment variables in your Vercel project settings:

1. **Go to your Vercel project**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables:**

### 🔑 Authentication
```bash
# GitHub OAuth App Credentials
AUTH_GITHUB_ID=Ov23li2bS0do8SIZ4KCw
AUTH_GITHUB_SECRET=your_github_oauth_secret

# Better Auth Secret (generate a random 32+ character string)
BETTER_AUTH_SECRET=your_super_secret_random_string_here

# Base URL for OAuth redirects
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 🗄️ Database
```bash
# MongoDB Connection String
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Optional: Specify database name (defaults to clickchutney_prod in production)
DATABASE_NAME=clickchutney_prod
```

### 🌐 Optional
```bash
# Public base URL (useful for client-side redirects)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## 📋 Environment Variables Checklist

### Required for Production:
- [ ] `AUTH_GITHUB_ID` - Your GitHub OAuth App Client ID
- [ ] `AUTH_GITHUB_SECRET` - Your GitHub OAuth App Client Secret  
- [ ] `BETTER_AUTH_SECRET` - Random secret string (32+ chars)
- [ ] `DATABASE_URL` - MongoDB connection string
- [ ] `NEXTAUTH_URL` - Your production domain URL

### Optional:
- [ ] `DATABASE_NAME` - Custom database name
- [ ] `NEXT_PUBLIC_BASE_URL` - Public base URL

## 🔧 GitHub OAuth App Setup

1. **Go to GitHub Settings → Developer settings → OAuth Apps**
2. **Create a new OAuth App**
3. **Set the following:**
   - **Application name**: `ClickChutney Analytics`
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. **Copy the Client ID and Client Secret to Vercel environment variables**

## 🗄️ MongoDB Database Setup

1. **Create a MongoDB cluster** (MongoDB Atlas recommended)
2. **Create a database user** with read/write access
3. **Get the connection string** and set it as `DATABASE_URL`
4. **Whitelist Vercel IPs** or use `0.0.0.0/0` for all IPs

## 🚀 Deployment Commands

The project will automatically:
1. Generate Prisma client
2. Push database schema to MongoDB
3. Build the Next.js application

## 🔍 Troubleshooting

### Build Warnings
- ✅ GitHub OAuth warnings during build are now suppressed
- ✅ Database connection warnings during build are handled
- ✅ All environment variables are properly validated

### Runtime Issues
- Check Vercel function logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure GitHub OAuth callback URL matches exactly

### Environment Variable Validation
Run this locally to check your environment setup:
```bash
node scripts/check-env.js
```

## 📝 Notes

- The app uses MongoDB with Prisma as the ORM
- Authentication is handled by Better Auth with GitHub OAuth
- Database schema is automatically synced on deployment
- Development and production use separate databases by default