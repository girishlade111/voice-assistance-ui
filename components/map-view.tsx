"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface MapViewProps {
  destination: string
}

export default function MapView({ destination }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This would normally initialize a map library like Google Maps or Mapbox
    // For this example, we'll just show a placeholder
    if (mapRef.current) {
      const ctx = document.createElement("canvas").getContext("2d")
      if (ctx) {
        ctx.canvas.width = mapRef.current.clientWidth
        ctx.canvas.height = 400

        // Dark background
        ctx.fillStyle = "#1e293b"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw some map-like elements with dark theme
        ctx.fillStyle = "#334155"
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(
            Math.random() * ctx.canvas.width,
            Math.random() * ctx.canvas.height,
            Math.random() * 100 + 50,
            Math.random() * 100 + 20,
          )
        }

        // Draw roads
        ctx.strokeStyle = "#475569"
        ctx.lineWidth = 3
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(Math.random() * ctx.canvas.width, 0)
          ctx.lineTo(Math.random() * ctx.canvas.width, ctx.canvas.height)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(0, Math.random() * ctx.canvas.height)
          ctx.lineTo(ctx.canvas.width, Math.random() * ctx.canvas.height)
          ctx.stroke()
        }

        // Draw center point with purple gradient
        const gradient = ctx.createRadialGradient(
          ctx.canvas.width / 2,
          ctx.canvas.height / 2,
          0,
          ctx.canvas.width / 2,
          ctx.canvas.height / 2,
          15,
        )
        gradient.addColorStop(0, "#a855f7")
        gradient.addColorStop(1, "#3b82f6")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 12, 0, 2 * Math.PI)
        ctx.fill()

        // Add destination text
        ctx.fillStyle = "#f1f5f9"
        ctx.font = "16px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(destination, ctx.canvas.width / 2, ctx.canvas.height / 2 - 25)

        mapRef.current.innerHTML = ""
        mapRef.current.appendChild(ctx.canvas)
      }
    }
  }, [destination])

  return (
    <Card className="p-6 bg-slate-700/30 border-slate-600/30">
      <div className="text-center mb-4">
        <h3 className="font-medium text-white">Map View: {destination}</h3>
        <p className="text-sm text-gray-400">Interactive map would be displayed here</p>
      </div>
      <div ref={mapRef} className="h-[400px] bg-slate-800 rounded-md overflow-hidden border border-slate-600/30"></div>
    </Card>
  )
}
