export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4 animate-float">
            ClickChutney
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-chart-1 to-chart-2 mx-auto rounded-full"></div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-muted-foreground mb-6 animate-float-delayed">
            Something Amazing is Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We&apos;re working hard to bring you something incredible. Stay tuned!
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-chart-1 rounded-full animate-bounce-slow"></div>
            <div className="w-3 h-3 bg-chart-2 rounded-full animate-bounce-slow" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-chart-3 rounded-full animate-bounce-slow" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
