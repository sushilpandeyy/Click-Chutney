import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-display text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            ClickChutney
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/fonts">Fonts</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-chart-1/10 px-6 py-3 rounded-full border border-primary/20 backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-sm font-medium text-primary">Live Beta • Join 500+ Founders</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="font-display font-bold tracking-tight text-6xl md:text-8xl lg:text-9xl">
                <span className="block text-foreground leading-none">Click</span>
                <span className="block bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent leading-none">
                  Chutney
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-serif">
                The <span className="text-primary font-semibold">tastiest</span> way to track your website. 
                <br className="hidden md:block" />
                Get <span className="text-chart-1 font-semibold">spicy insights</span> that actually matter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 font-semibold text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/dashboard">
                  🚀 Start Tracking Free
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105"
              >
                👀 See Live Demo
              </Button>
            </div>

            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-muted-foreground text-sm">Trusted by</div>
              <div className="flex space-x-6">
                <div className="w-8 h-8 bg-gradient-to-r from-chart-1/20 to-chart-2/20 border border-border rounded-lg"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-chart-2/20 to-chart-3/20 border border-border rounded-lg"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-chart-3/20 to-chart-4/20 border border-border rounded-lg"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-chart-4/20 to-primary/20 border border-border rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
              Why Choose <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">ClickChutney?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop drowning in boring dashboards. Get analytics that are as exciting as street food.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-chart-1 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Lightning Fast Setup</h3>
                <p className="text-muted-foreground leading-relaxed">
                  One line of code. Seriously. Faster than ordering your favorite chaat. 
                  No complex configurations or endless documentation.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-chart-1/40">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-chart-1 to-chart-2 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Real-Time Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch your data update live. See every click, scroll, and conversion 
                  as it happens. No delays, no waiting.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-chart-3/40">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-chart-3 to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  GDPR compliant out of the box. No cookies, no tracking users across sites. 
                  Just clean, respectful analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-chart-1/10 border border-primary/20 rounded-full">
                  <span className="text-primary text-sm font-medium">🌶️ Hot Features</span>
                </div>
                <h2 className="font-display text-5xl font-bold text-foreground leading-tight">
                  Analytics that don&apos;t suck
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Finally, web analytics that make sense. No more spreadsheet hell or confusing dashboards. 
                  Just the insights you actually need.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mt-1">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">Beautiful Dashboards</h4>
                    <p className="text-muted-foreground">Charts that actually look good and make sense</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-chart-1 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">Smart Alerts</h4>
                    <p className="text-muted-foreground">Get notified when something important happens</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-chart-2 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">Team Collaboration</h4>
                    <p className="text-muted-foreground">Share insights with your team effortlessly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-1/20 blur-3xl"></div>
              <div className="relative bg-card backdrop-blur-sm border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-primary to-chart-1 rounded-full"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-16 bg-muted rounded-lg"></div>
                      <div className="h-16 bg-muted rounded-lg"></div>
                      <div className="h-16 bg-muted rounded-lg"></div>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-muted to-card rounded-lg border border-border"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
              Ready to taste the difference?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of founders who&apos;ve already discovered analytics that actually make sense.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-12 py-6 font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <Link href="/dashboard">
                🚀 Start Free Today
              </Link>
            </Button>
          </div>

          <div className="pt-12">
            <p className="text-muted-foreground text-sm">
              No credit card required • Setup in under 60 seconds • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="font-display text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent mb-4">
                ClickChutney
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Analytics that brings flavor to your data. Built with love for the developer community.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="w-4 h-4 bg-foreground rounded-sm"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="w-4 h-4 bg-foreground rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="w-4 h-4 bg-foreground rounded"></div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 ClickChutney. Analytics with flavor.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-xs text-muted-foreground">Made with 💖 for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}