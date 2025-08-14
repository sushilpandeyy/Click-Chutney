import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-60"></div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Main heading with Poppins font */}
        <div className="mb-12">
          <h1 className="font-poppins text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 animate-[float_3s_ease-in-out_infinite]">
            ClickChutney
          </h1>
          
          {/* Mango-colored accent line */}
          <div className="w-32 h-1 bg-gradient-to-r from-mango to-golden-mango mx-auto rounded-full mb-8 animate-[chutney-glow_4s_ease-in-out_infinite]"></div>
          
          {/* Subtitle with Inter font */}
          <h2 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6">
            Analytics Made Digestible
          </h2>
        </div>
        
        {/* Description */}
        <div className="mb-16">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Like sharing snacks with friends, ClickChutney makes data enjoyable and accessible. 
            Track your website&apos;s story with the warmth of Indian street food culture.
          </p>
          
          {/* Tagline */}
          <p className="text-base text-primary font-medium">
            🌶️ Spice up your analytics • 🥭 Sweet insights • 🫖 Served fresh
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Cooking 🍳
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-3 text-lg font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-300"
          >
            Taste Demo 👅
          </Button>
        </div>

        {/* Animated food-inspired indicators */}
        <div className="flex justify-center items-center space-x-6">
          <div className="w-4 h-4 rounded-full bg-mango animate-[spice-bounce_2s_ease-in-out_infinite] shadow-lg"></div>
          <div className="w-3 h-3 rounded-full bg-fresh-coriander animate-[spice-bounce_2s_ease-in-out_infinite] shadow-lg" style={{animationDelay: '0.2s'}}></div>
          <div className="w-5 h-5 rounded-full bg-spicy-red animate-[spice-bounce_2s_ease-in-out_infinite] shadow-lg" style={{animationDelay: '0.4s'}}></div>
          <div className="w-3 h-3 rounded-full bg-masala-brown animate-[spice-bounce_2s_ease-in-out_infinite] shadow-lg" style={{animationDelay: '0.6s'}}></div>
        </div>
        
        {/* Subtle footer text */}
        <p className="text-sm text-muted-foreground mt-12 opacity-70">
          Analytics that bring people together, just like good food
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-8 h-8 rounded-full bg-primary/20 animate-[samosa-roll_8s_linear_infinite]"></div>
      <div className="absolute bottom-32 right-16 w-6 h-6 rounded-full bg-success/20 animate-[float_4s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/3 right-10 w-4 h-4 rounded-full bg-destructive/20 animate-[spice-bounce_3s_ease-in-out_infinite]"></div>
    </div>
  );
}
