import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4 animate-[float_3s_ease-in-out_infinite]">
            ClickChutney
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-chart-1 to-chart-2 mx-auto rounded-full"></div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-muted-foreground mb-6 animate-[float-delayed_4s_ease-in-out_infinite]">
            Analytics Dashboard Components
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            Testing our UI components for the analytics platform!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Button Component</CardTitle>
              <CardDescription>Various button styles and variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Component</CardTitle>
              <CardDescription>This is a card component with header, content, and footer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perfect for displaying analytics data, project information, and dashboard widgets.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog Component</CardTitle>
              <CardDescription>Modal dialogs for user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sample Dialog</DialogTitle>
                    <DialogDescription>
                      This is a sample dialog component that will be used throughout the analytics dashboard.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-chart-1 rounded-full animate-[bounce-slow_2s_ease-in-out_infinite]"></div>
            <div className="w-3 h-3 bg-chart-2 rounded-full animate-[bounce-slow_2s_ease-in-out_infinite]" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-chart-3 rounded-full animate-[bounce-slow_2s_ease-in-out_infinite]" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
