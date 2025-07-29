"use client"

import { AnimatedCounter } from "./animated-counter"
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-gray-600 font-medium">Happy Developers</p>
              <p className="text-sm text-gray-500">Loving the spice!</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                <AnimatedCounter end={99} suffix="%" />
              </div>
              <p className="text-gray-600 font-medium">Uptime</p>
              <p className="text-sm text-gray-500">Rock solid!</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-red-600 mb-2">
                <AnimatedCounter end={50} suffix="ms" />
              </div>
              <p className="text-gray-600 font-medium">Load Time</p>
              <p className="text-sm text-gray-500">Lightning fast!</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-600 mb-2">
                <AnimatedCounter end={24} suffix="/7" />
              </div>
              <p className="text-gray-600 font-medium">Support</p>
              <p className="text-sm text-gray-500">Always here!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
