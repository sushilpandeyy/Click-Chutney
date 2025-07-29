"use client"

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 right-10 animate-float">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
          🥭
        </div>
      </div>

      <div className="absolute bottom-32 left-16 animate-float-delayed">
        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-xl shadow-lg">
          🌶️
        </div>
      </div>

      <div className="absolute top-1/2 left-8 animate-float-slow">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-xl shadow-lg">
          🥟
        </div>
      </div>

      <div className="absolute top-1/3 right-20 animate-bounce-slow">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-lg shadow-lg">
          🌿
        </div>
      </div>
    </div>
  )
}
