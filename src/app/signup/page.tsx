"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleGitHubSignup = async () => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <div className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              ClickChutney
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your analytics journey
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <Button 
            onClick={handleGitHubSignup}
            className="w-full h-12 gap-3 font-semibold"
            size="lg"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <span>Already have an account? </span>
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </Link>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>By signing up, you agree to our</p>
              <div className="space-x-1">
                <Link href="#" className="text-primary hover:text-primary/80">Terms of Service</Link>
                <span>and</span>
                <Link href="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}