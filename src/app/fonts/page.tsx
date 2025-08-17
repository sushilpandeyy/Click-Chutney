'use client';

export default function FontsPage() {
  const sampleText = "The quick brown fox jumps over the lazy dog";
  const weights = [
    { name: "Light Weight Text", class: "font-light" },
    { name: "Regular Weight Text", class: "font-regular" },
    { name: "Medium Weight Text", class: "font-medium" },
    { name: "Semibold Weight Text", class: "font-semibold" },
    { name: "Bold Weight Text", class: "font-bold" },
  ];

  const FontShowcase = ({ 
    title, 
    fontClass, 
    description 
  }: { 
    title: string; 
    fontClass: string; 
    description: string; 
  }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-2 font-display">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <div className="space-y-4">
        {weights.map((weight) => (
          <div key={weight.name} className="border-b border-border pb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {weight.name}
            </h3>
            <p className={`text-lg ${fontClass} ${weight.class} text-foreground`}>
              {sampleText}
            </p>
            <p className={`text-xl ${fontClass} ${weight.class} text-foreground mt-1`}>
              ClickChutney Analytics Platform
            </p>
            <p className={`text-2xl ${fontClass} ${weight.class} text-foreground mt-1`}>
              Modern Typography
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-display bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            Font Showcase
          </h1>
          <p className="text-xl text-muted-foreground font-regular">
            View theme fonts in different styles and weights
          </p>
        </div>

        {/* Font Showcases */}
        <div className="space-y-16">
          <FontShowcase
            title="Sans-Serif"
            fontClass="font-sans"
            description="Inter - Clean, modern sans-serif font perfect for body text and interfaces"
          />

          <FontShowcase
            title="Serif"
            fontClass="font-serif"
            description="Playfair Display - Elegant serif font ideal for headings and emphasis"
          />

          <FontShowcase
            title="Monospace"
            fontClass="font-mono"
            description="JetBrains Mono - Professional monospace font for code and technical content"
          />
        </div>

        {/* Usage Examples */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl font-semibold text-foreground mb-8 font-display">
            Usage Examples
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Code Example */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 font-display">
                Code Block
              </h3>
              <pre className="font-mono font-regular text-sm text-chart-1 bg-muted p-4 rounded-lg overflow-x-auto">
{`// TypeScript Example
interface AnalyticsConfig {
  trackingId: string;
  endpoint?: string;
  autoPageview?: boolean;
}

const config: AnalyticsConfig = {
  trackingId: "CC-123456",
  endpoint: "/api/analytics",
  autoPageview: true
};`}
              </pre>
            </div>

            {/* Article Example */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 font-display">
                Article Content
              </h3>
              <div className="space-y-4">
                <h4 className="text-xl font-serif font-medium text-foreground">
                  The Future of Analytics
                </h4>
                <p className="font-sans font-regular text-muted-foreground leading-relaxed">
                  Modern analytics platforms are evolving to provide deeper insights 
                  with better user experiences. ClickChutney represents this new 
                  generation of tools.
                </p>
                <p className="font-sans font-light text-muted-foreground leading-relaxed">
                  With our comprehensive font system, we ensure optimal readability 
                  across all content types and use cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl font-semibold text-foreground mb-8 font-display">
            Technical Specifications
          </h2>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-display font-semibold text-foreground mb-3">
                  Font Families
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li>--font-sans: Inter</li>
                  <li>--font-serif: Playfair Display</li>
                  <li>--font-mono: JetBrains Mono</li>
                  <li>--font-display: Poppins</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-display font-semibold text-foreground mb-3">
                  Font Weights
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li>--font-light: 300</li>
                  <li>--font-regular: 400</li>
                  <li>--font-medium: 500</li>
                  <li>--font-semibold: 600</li>
                  <li>--font-bold: 700</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-display font-semibold text-foreground mb-3">
                  CSS Classes
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li>.font-sans</li>
                  <li>.font-serif</li>
                  <li>.font-mono</li>
                  <li>.font-light</li>
                  <li>.font-[weight]</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-display"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}