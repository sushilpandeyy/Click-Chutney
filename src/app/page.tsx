import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Shield, Zap, CheckCircle, Users, TrendingUp, Globe, Award } from 'lucide-react';

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
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link href="#customers" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Customers
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-chart-1/10 px-6 py-3 rounded-full border border-primary/20 backdrop-blur-sm">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Trusted by 10,000+ businesses worldwide</span>
            </div>
            
            <div className="space-y-8">
              <h1 className="font-display font-bold tracking-tight text-responsive-2xl md:text-responsive-3xl">
                <span className="block text-foreground leading-none mb-4">Enterprise Analytics</span>
                <span className="block bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent leading-none">
                  That Actually Works
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Get <span className="text-primary font-semibold">actionable insights</span> from your data with our GDPR-compliant analytics platform. 
                <br className="hidden md:block" />
                Trusted by <span className="text-chart-1 font-semibold">enterprise teams</span> who value privacy and performance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto px-10 py-5 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover-lift gap-3"
              >
                <Link href="/signup">
                  <ArrowRight className="w-5 h-5" />
                  Start 14-Day Free Trial
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-5 font-semibold text-lg rounded-xl hover-lift gap-2"
                asChild
              >
                <Link href="#demo">
                  <BarChart3 className="w-5 h-5" />
                  View Live Demo
                </Link>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              ✓ No credit card required &nbsp;•&nbsp; ✓ Setup in 5 minutes &nbsp;•&nbsp; ✓ GDPR compliant
            </div>

            <div className="flex justify-center items-center space-x-8 pt-12">
              <div className="text-muted-foreground text-sm font-medium">Trusted by leading companies</div>
              <div className="flex space-x-8 opacity-60">
                <div className="w-24 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-6 bg-gradient-to-r from-primary/30 to-chart-1/30 rounded"></div>
                </div>
                <div className="w-24 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-6 bg-gradient-to-r from-chart-2/30 to-chart-3/30 rounded"></div>
                </div>
                <div className="w-24 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-6 bg-gradient-to-r from-chart-4/30 to-primary/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <span className="text-primary text-sm font-semibold">POWERFUL FEATURES</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Everything you need for 
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"> data-driven decisions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our enterprise-grade analytics platform provides the insights your team needs to optimize performance and drive growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Quick Integration</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Deploy in minutes with our lightweight tracking script. One line of code gets you comprehensive analytics without impacting site performance.
                </p>
                <div className="mt-4 flex items-center text-xs text-primary font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sub-10kb script size
                </div>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-chart-1/40">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-chart-1/10 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-chart-1" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Real-Time Analytics</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Monitor user behavior as it happens with live dashboards and instant alerts. Make data-driven decisions with confidence.
                </p>
                <div className="mt-4 flex items-center text-xs text-chart-1 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  &lt;1s data latency
                </div>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-chart-3/40">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-chart-3/10 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-chart-3" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  GDPR, CCPA, and SOC 2 compliant. End-to-end encryption with granular access controls for enterprise peace of mind.
                </p>
                <div className="mt-4 flex items-center text-xs text-chart-3 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ISO 27001 certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-chart-1/10 border border-primary/20 rounded-full">
                  <span className="text-primary text-sm font-semibold">ADVANCED CAPABILITIES</span>
                </div>
                <h2 className="font-display text-4xl font-bold text-foreground leading-tight">
                  Enterprise-grade analytics
                  <br />
                  <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                    built for growth
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Comprehensive user behavior analysis with actionable insights. 
                  From conversion optimization to user journey mapping, get the complete picture.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mt-1">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">Advanced Visualization</h4>
                    <p className="text-muted-foreground">Interactive dashboards with drill-down capabilities and custom reporting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-chart-1/10 rounded-xl flex items-center justify-center mt-1">
                    <Users className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">User Journey Mapping</h4>
                    <p className="text-muted-foreground">Track complete user paths and identify optimization opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-chart-2/10 rounded-xl flex items-center justify-center mt-1">
                    <Globe className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-lg">Multi-site Management</h4>
                    <p className="text-muted-foreground">Centralized analytics for all your properties with unified reporting</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <Button asChild size="lg" className="gap-2">
                  <Link href="#demo">
                    <ArrowRight className="w-5 h-5" />
                    Explore All Features
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-chart-1/10 blur-3xl"></div>
              <div className="relative bg-background backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground">Live Dashboard Preview</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Page Views</div>
                        <div className="text-lg font-bold text-foreground">24,847</div>
                        <div className="text-xs text-chart-4">+12.4%</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Conversions</div>
                        <div className="text-lg font-bold text-foreground">1,283</div>
                        <div className="text-xs text-chart-4">+8.2%</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
                        <div className="text-lg font-bold text-foreground">23.4%</div>
                        <div className="text-xs text-chart-1">-3.1%</div>
                      </div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="bg-card border border-border rounded-lg p-4 h-32">
                      <div className="w-full h-full bg-gradient-to-r from-primary/20 via-chart-1/20 to-chart-2/20 rounded opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="customers" className="relative py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Trusted by teams at leading companies
            </h2>
            <p className="text-muted-foreground text-lg">
              Join 10,000+ businesses using ClickChutney for actionable analytics
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-background border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground text-sm">Uptime SLA</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-chart-1 mb-2">500M+</div>
              <div className="text-muted-foreground text-sm">Events processed monthly</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-chart-2 mb-2">10,000+</div>
              <div className="text-muted-foreground text-sm">Active websites</div>
            </div>
          </div>
          
          <div className="text-center">
            <blockquote className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
              "ClickChutney transformed how we understand our users. The insights are actionable and the setup was incredibly straightforward."
            </blockquote>
            <cite className="text-sm font-medium text-foreground">Sarah Chen, Head of Growth at TechCorp</cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-primary/10 via-background to-chart-1/10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Ready to unlock your data&apos;s potential?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses making data-driven decisions with ClickChutney. Start your free trial today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-10 py-6 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl gap-2"
            >
              <Link href="/signup">
                <ArrowRight className="w-5 h-5" />
                Start 14-Day Free Trial
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-8 py-6 font-semibold text-lg rounded-xl gap-2"
              asChild
            >
              <Link href="#demo">
                <BarChart3 className="w-5 h-5" />
                Schedule Demo
              </Link>
            </Button>
          </div>

          <div className="pt-8">
            <p className="text-muted-foreground text-sm">
              ✓ No credit card required &nbsp;•&nbsp; ✓ Full access to all features &nbsp;•&nbsp; ✓ Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <span className="text-primary text-sm font-semibold">PRICING PLANS</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core analytics features with enterprise-grade security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-background border border-border rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Starter</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-foreground">Free</span>
                </div>
                <p className="text-muted-foreground text-sm">Perfect for small projects and personal websites</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Up to 10,000 page views/month
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Real-time analytics dashboard
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Basic reporting
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Email support
                </li>
              </ul>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-background border-2 border-primary rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Professional</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-foreground">$29</span>
                  <span className="text-muted-foreground text-sm ml-2">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">For growing businesses and marketing teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Up to 100,000 page views/month
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Advanced analytics & funnels
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Custom events tracking
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Team collaboration (5 users)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Priority support
                </li>
              </ul>
              
              <Button className="w-full" asChild>
                <Link href="/signup">Start 14-Day Trial</Link>
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-background border border-border rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-foreground">Custom</span>
                </div>
                <p className="text-muted-foreground text-sm">For large organizations with custom needs</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Unlimited page views
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Advanced segmentation
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  API access & integrations
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Unlimited team members
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-chart-4 mr-3" />
                  Dedicated support manager
                </li>
              </ul>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              All plans include GDPR compliance, SSL encryption, and 99.9% uptime SLA
            </p>
            <Button variant="ghost" asChild>
              <Link href="#faq" className="text-primary hover:text-primary/80">
                View detailed feature comparison →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="font-display text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent mb-4">
                ClickChutney
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Enterprise-grade web analytics platform built for privacy-conscious businesses. Get actionable insights without compromising user privacy.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-chart-3" />
                  <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-chart-4" />
                  <span className="text-xs text-muted-foreground">GDPR Compliant</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#customers" className="hover:text-foreground transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">
                  © 2024 ClickChutney Analytics, Inc. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">All systems operational</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}