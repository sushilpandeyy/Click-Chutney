# @click-chutney/analytics

**Simple website analytics that actually works.** Track visitors on your website without the complexity.

## 🚀 Super Easy Setup

### For React/Next.js Apps

**Step 1:** Install it
```bash
npm install @click-chutney/analytics
```

**Step 2:** Add your tracking code to `.env.local`
```bash
NEXT_PUBLIC_CLICKCHUTNEY_ID=your_tracking_id_here
```

**Step 3:** Add one line to your app
```tsx
// In your main layout file
import { Analytics } from '@click-chutney/analytics/react';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Just add this line! */}
      </body>
    </html>
  );
}
```

> **Important:** Always import from `@click-chutney/analytics/react` for React components!

**That's it!** 🎉 Your website is now being tracked.

### For Regular Websites (HTML/WordPress)

Add these 2 lines to your `<head>` section:
```html
<script src="https://unpkg.com/@click-chutney/analytics@2.0.9/dist/clickchutney.min.js"></script>
<script>cc('init', 'your_tracking_id_here');</script>
```

## ✨ What Gets Tracked Automatically

- **Page views** - Every time someone visits a page
- **Button clicks** - When people click your buttons
- **Link clicks** - When people click your links  
- **Form submissions** - When people fill out forms
- **Time on site** - How long people stay
- **Where visitors come from** - Which websites send you traffic

## 📊 Custom Event Tracking

Want to track something specific? Use the hook:

```tsx
import { useAnalytics } from '@click-chutney/analytics/react';

function MyButton() {
  const analytics = useAnalytics();
  
  const handleClick = () => {
    analytics.track('signup_clicked', { 
      plan: 'premium',
      source: 'homepage' 
    });
  };
  
  return <button onClick={handleClick}>Sign Up</button>;
}
```

## 🛠 Simple Options

```tsx
<Analytics 
  trackingId="your_id"           // Your tracking ID
  debug={true}                   // See what's happening in console
  disableInDev={false}           // Track even in development
/>
```

## 🆘 Not Working? Check These:

1. **No data showing up?**
   - Make sure you added your tracking ID to `.env.local`
   - Check if `<Analytics />` is in your layout file
   - Look in browser console for error messages

2. **Getting errors?**
   - Make sure your tracking ID starts with `cc_`
   - Check that you're using the latest version: `npm update @click-chutney/analytics`

3. **Server Component errors?**
   Our React component now includes proper `"use client"` directive. If you still have issues, try:
   ```tsx
   import dynamic from 'next/dynamic';
   
   const Analytics = dynamic(() => 
     import('@click-chutney/analytics/react').then(mod => ({ default: mod.Analytics })), 
     { ssr: false }
   );
   ```

## 🏷 Works With Everything

- ✅ Next.js (App Router & Pages)
- ✅ React apps (Create React App, Vite)
- ✅ HTML websites
- ✅ WordPress
- ✅ Any website that can run JavaScript

## 🔒 Privacy Friendly

- No cookies stored
- Respects "Do Not Track" settings
- GDPR compliant
- Automatically disabled during development

## 📞 Need Help?

- 📖 Full documentation: [clickchutney.com/docs](https://clickchutney.com/docs)
- 🐛 Report issues: [GitHub Issues](https://github.com/clickchutney/analytics/issues)
- 💬 Get support: [Discord Community](https://discord.gg/clickchutney)

## 📈 Get Your Tracking ID

1. Go to [ClickChutney.com](https://clickchutney.com)
2. Create a free account
3. Add your website
4. Copy your tracking ID (looks like `cc_abc123...`)
5. Add it to your `.env.local` file

**Free plan includes:**
- 10,000 page views per month
- Real-time analytics
- Custom events
- No time limits

---

Made with ❤️ by the ClickChutney team. 

**Questions?** Just ask in our [Discord](https://discord.gg/clickchutney) - we're friendly! 😊