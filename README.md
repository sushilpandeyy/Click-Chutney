# ClickChutney Analytics

A complete, real-time analytics platform built with Next.js 15 that provides comprehensive website tracking and insights through an easy-to-integrate NPM package.

## 🚀 Project Status

**Current Version:** 1.2.2 (NPM Package)  
**Status:** Production Ready  
**Last Updated:** January 2025

### Recent Progress
- ✅ **Plugin System Complete** - NPM package published at `@click-chutney/analytics@1.2.2`
- ✅ **AWS Lambda Processing** - Serverless analytics processing with geolocation enrichment
- ✅ **Dashboard System** - Full-featured Next.js 15 dashboard with real-time analytics
- ✅ **Domain Verification** - Automatic domain verification on first analytics hit
- ✅ **Authentication System** - GitHub OAuth integration with Better Auth
- ✅ **Database Schema** - MongoDB with Prisma ORM for scalable data storage

## 🎯 What is ClickChutney?

ClickChutney is a privacy-focused, real-time analytics platform that helps you understand your website's performance without compromising user privacy. It provides:

- **Real-time Analytics** - Live visitor tracking and event monitoring
- **Easy Integration** - Simple NPM package for React/Next.js and vanilla HTML/WordPress
- **Privacy-First** - No invasive tracking, respects user privacy
- **Custom Events** - Track specific user interactions and conversions
- **Geolocation Insights** - IP-based location analytics without storing personal data
- **Session Management** - Comprehensive visitor session tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** + **Radix UI** for modern UI components
- **Better Auth** with GitHub OAuth

### Backend
- **AWS Lambda** for serverless analytics processing
- **MongoDB** with **Prisma ORM** for data storage
- **Node.js** runtime environment

### Infrastructure
- **Vercel** deployment platform
- **MongoDB Atlas** cloud database
- **AWS API Gateway** for Lambda endpoints
- **NPM Registry** for package distribution

## 📦 Quick Start

### 1. For React/Next.js Projects
```bash
npm install @click-chutney/analytics
```

```javascript
import ClickChutney from '@click-chutney/analytics';

// Initialize with your tracking ID
ClickChutney.init('cc_your_tracking_id');

// Track page views
ClickChutney.page();

// Track custom events
ClickChutney.track('button_click', { 
  button: 'signup',
  location: 'header' 
});
```

### 2. For HTML/WordPress Sites
```html
<script src="https://unpkg.com/@click-chutney/analytics@1.2.2/dist/clickchutney.min.js"></script>
<script>
  cc('init', 'cc_your_tracking_id');
</script>
```

### 3. Get Your Tracking ID
1. Visit [ClickChutney Dashboard](https://clickchutney.vercel.app)
2. Sign in with GitHub
3. Create a new project
4. Copy your unique tracking ID

## 🏗 Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- GitHub OAuth App

### Environment Variables
```env
DATABASE_URL=mongodb+srv://...
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd clickchutney

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

### Available Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to MongoDB
- `npm run db:studio` - Open Prisma Studio

## 🌟 Key Features

### Analytics Plugin
- **Automatic Page Tracking** - Detects navigation changes
- **Custom Event API** - Track specific user actions
- **Session Management** - Unique visitor identification
- **Batch Processing** - Efficient event batching (3s intervals)
- **SSR Compatibility** - Works with Next.js server-side rendering

### Dashboard
- **Project Management** - Create and manage multiple websites
- **Real-time Analytics** - Live visitor and event data
- **Domain Verification** - Secure project setup process
- **User Settings** - Account and notification preferences

### AWS Lambda Processing
- **Event Validation** - Secure tracking ID verification
- **Geolocation Enrichment** - IP-based location data
- **Auto-verification** - Automatic domain verification
- **Scalable Processing** - Serverless architecture

## 🚧 Architecture

```
Website (Plugin) → AWS Lambda → MongoDB → Next.js Dashboard
     ↓              ↓           ↓            ↓
  Track Events → Validate & → Store Data → Display Analytics
                 Enrich
```

### Data Flow
1. **Collection**: Plugin collects events on client websites
2. **Processing**: AWS Lambda validates and enriches event data
3. **Storage**: Events stored in MongoDB with project association
4. **Visualization**: Dashboard displays real-time analytics

## 🔮 Future Plans

### Q1 2025
- [ ] **Advanced Analytics**
  - Funnel analysis and conversion tracking
  - A/B testing integration
  - Custom dashboard widgets

- [ ] **Enhanced Privacy Features**
  - GDPR compliance tools
  - Cookie consent management
  - Data retention controls

### Q2 2025
- [ ] **Enterprise Features**
  - Team management and collaboration
  - Advanced user permissions
  - White-label solutions

- [ ] **Integration Ecosystem**
  - Slack/Discord notifications
  - Webhook support for external tools
  - API for custom integrations

### Q3 2025
- [ ] **Advanced Insights**
  - AI-powered analytics recommendations
  - Predictive user behavior analysis
  - Advanced segmentation tools

- [ ] **Performance Optimization**
  - Edge computing for faster processing
  - Advanced caching strategies
  - Multi-region deployment

## 📊 Current Metrics

- **Plugin Downloads**: Growing steadily on NPM
- **Active Projects**: Multiple verified domains
- **Event Processing**: Real-time with <100ms latency
- **Uptime**: 99.9% availability on AWS infrastructure

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and feel free to submit issues or pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Dashboard**: [https://clickchutney.vercel.app](https://clickchutney.vercel.app)
- **NPM Package**: [@click-chutney/analytics](https://www.npmjs.com/package/@click-chutney/analytics)
- **Documentation**: Coming soon
- **Support**: GitHub Issues

---

**Built with ❤️ for developers who care about privacy-first analytics**
