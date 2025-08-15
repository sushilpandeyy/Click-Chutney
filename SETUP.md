# 🍛 ClickChutney Analytics - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- GitHub account for OAuth

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sushilpandeyy/Click-Chutney.git
cd Click-Chutney
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Generate secrets (macOS/Linux)
openssl rand -base64 32

# Edit .env with your actual values
# Required: DATABASE_URL, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, BETTER_AUTH_SECRET
```

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔑 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SECRET` | Authentication secret | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_SECRET` | Better Auth secret | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL for auth | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | From GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | From GitHub OAuth App |
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Public base URL | Same as NEXTAUTH_URL |
| `DATABASE_NAME` | Custom DB name | `clickchutney_dev` (dev) / `clickchutney_prod` (prod) |

---

## 🔧 GitHub OAuth Setup

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Create OAuth App**
   ```
   Application name: ClickChutney Analytics
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

3. **Copy Credentials**
   - Copy Client ID → `GITHUB_CLIENT_ID`
   - Generate Client Secret → `GITHUB_CLIENT_SECRET`

---

## 🗄️ MongoDB Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get connection string and set as `DATABASE_URL`

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Use local connection
DATABASE_URL="mongodb://localhost:27017/clickchutney"
```

---

## 🚀 Available Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# Check environment variables
node scripts/check-env.js

# Generate Prisma client only
npx prisma generate

# Push database schema changes
npx prisma db push

# Reset database (careful!)
npx prisma db push --reset
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Build and start
npm run build && npm start
```

### Database Commands
```bash
# View database in Prisma Studio
npx prisma studio

# Generate and push schema
npx prisma generate && npx prisma db push

# View generated SQL for debugging
npx prisma db push --preview-only
```

---

## 🧪 Testing the Setup

1. **Check Environment**
   ```bash
   node scripts/check-env.js
   ```

2. **Test Database Connection**
   ```bash
   curl http://localhost:3000/api/debug/db
   ```

3. **Test GitHub OAuth**
   - Visit http://localhost:3000/signup
   - Click "Continue with GitHub"
   - Should redirect to GitHub authorization

4. **Test Dashboard**
   - Complete GitHub OAuth flow
   - Should redirect to dashboard
   - Create sample data for testing

---

## 🔍 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all required environment variables are set
- Run `npx prisma generate` before building
- Check TypeScript errors with `npm run build`

**Database Connection Issues**
- Verify `DATABASE_URL` format
- Check network connectivity to MongoDB
- Ensure database user has proper permissions

**GitHub OAuth Issues**
- Verify callback URL matches exactly
- Check GitHub OAuth app configuration
- Ensure `GITHUB_CLIENT_*` variables are set correctly

**Environment Variable Issues**
- Use `node scripts/check-env.js` to validate
- Ensure `.env` file exists (copy from `.env.example`)
- Don't commit `.env` to version control

### Getting Help
- Check the logs in the development console
- Verify all environment variables are properly set
- Ensure MongoDB is accessible and has the correct permissions
- Double-check GitHub OAuth app configuration

---

## 📁 Project Structure

```
clickchutney/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   ├── lib/                 # Utilities & configuration
│   └── components/          # Reusable components
├── prisma/
│   └── schema.prisma        # Database schema
├── scripts/
│   └── check-env.js         # Environment validation
├── .env.example             # Environment template
├── SETUP.md                 # This file
└── DEPLOYMENT.md            # Production deployment guide
```