# 🚀 ClickChutney Deployment Guide

## Prerequisites
- Vercel account (recommended) or other hosting platform
- MongoDB Atlas database
- GitHub OAuth App configured
- All environment variables ready

---

## 🔧 Pre-Deployment Setup

### 1. Generate Secrets
```bash
# Generate authentication secrets
openssl rand -base64 32  # For AUTH_SECRET
openssl rand -base64 32  # For BETTER_AUTH_SECRET
```

### 2. MongoDB Atlas Setup
1. Create MongoDB Atlas cluster
2. Create database user with read/write permissions  
3. Whitelist all IPs (0.0.0.0/0) or specific hosting provider IPs
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/clickchutney?retryWrites=true&w=majority`

### 3. GitHub OAuth App (Production)
1. Create new OAuth App at https://github.com/settings/developers
2. Set **Homepage URL**: `https://your-domain.vercel.app`
3. Set **Callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret

---

## 🌐 Vercel Deployment

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" 
3. Import your ClickChutney repository
4. Configure project settings

### Step 2: Environment Variables
Set these in **Project Settings → Environment Variables**:

### 🔑 Required Variables
```bash
# Authentication Secrets (generate with: openssl rand -base64 32)
AUTH_SECRET=your_generated_32_character_secret
BETTER_AUTH_SECRET=your_generated_32_character_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# GitHub OAuth (from your production GitHub OAuth App)
AUTH_GITHUB_ID=your_production_github_client_id
AUTH_GITHUB_SECRET=your_production_github_client_secret

# MongoDB Database (from MongoDB Atlas)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/clickchutney?retryWrites=true&w=majority
```

### 🌐 Optional Variables
```bash
# Public base URL (useful for client-side redirects)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Custom database name (defaults to clickchutney_prod in production)
DATABASE_NAME=clickchutney_prod
```

### Step 3: Deploy
1. Click "Deploy" to trigger the first deployment
2. Monitor the build logs for any issues
3. The deployment will automatically:
   - Install dependencies
   - Generate Prisma client  
   - Push database schema to MongoDB
   - Build Next.js application
   - Deploy to production

---

## 📋 Environment Variables Checklist

Copy this checklist when setting up production environment:

### ✅ Required Variables
- [ ] `AUTH_SECRET` - Generated 32-character secret
- [ ] `BETTER_AUTH_SECRET` - Generated 32-character secret  
- [ ] `NEXTAUTH_URL` - Production domain URL
- [ ] `AUTH_GITHUB_ID` - Production GitHub OAuth Client ID
- [ ] `AUTH_GITHUB_SECRET` - Production GitHub OAuth Client Secret
- [ ] `DATABASE_URL` - MongoDB Atlas connection string

### 📝 Optional Variables
- [ ] `NEXT_PUBLIC_BASE_URL` - Public base URL
- [ ] `DATABASE_NAME` - Custom database name

---

## 🔧 Alternative Deployment Platforms

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in site settings

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🚀 Build Process

The deployment automatically runs:
```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Push database schema
npx prisma db push

# 4. Build Next.js application
npm run build
```

---

## 🔍 Troubleshooting

### Build Issues
- **Environment variables missing**: Verify all required variables are set in hosting platform
- **Database connection**: Ensure MongoDB Atlas allows connections from hosting platform
- **GitHub OAuth**: Verify production callback URL matches exactly

### Runtime Issues  
- **Authentication fails**: Check GitHub OAuth app configuration
- **Database errors**: Verify MongoDB connection string and permissions
- **CORS issues**: Ensure `NEXTAUTH_URL` matches your production domain

### Monitoring
- Check hosting platform logs for detailed error messages
- Use `node scripts/check-env.js` locally to validate environment setup
- Monitor MongoDB Atlas for connection and performance metrics

---

## 📊 Post-Deployment

### Verify Deployment
1. ✅ Visit your production URL
2. ✅ Test GitHub OAuth login flow
3. ✅ Create test project and verify dashboard
4. ✅ Check database has proper data structure

### Performance Optimization
- Enable Vercel Analytics for traffic insights
- Configure MongoDB Atlas performance advisor
- Set up monitoring alerts for errors and performance

### Security
- Regularly rotate authentication secrets
- Monitor GitHub OAuth app for suspicious activity
- Review MongoDB Atlas access logs
- Keep dependencies updated

---

## 📝 Production Notes

- **Database**: Production uses `clickchutney_prod` database by default
- **Authentication**: Better Auth with GitHub OAuth only  
- **Scaling**: Vercel automatically scales based on traffic
- **Monitoring**: Built-in error tracking and performance metrics
- **Updates**: Push to main branch triggers automatic redeployment