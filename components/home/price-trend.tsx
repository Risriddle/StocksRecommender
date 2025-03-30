"use client"

import { useEffect, useRef } from "react"

interface PriceTrendProps {
  data: number[]
  height: number
  positive: boolean
}

export function PriceTrend({ data, height, positive }: PriceTrendProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const padding = 2

    // Find min and max values
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min

    // Draw line
    ctx.beginPath()
    ctx.moveTo(padding, height - (((data[0] - min) / range) * (height - padding * 2) + padding))

    for (let i = 1; i < data.length; i++) {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding
      const y = height - (((data[i] - min) / range) * (height - padding * 2) + padding)
      ctx.lineTo(x, y)
    }

    // Style line
    ctx.strokeStyle = positive ? "#16a34a" : "#dc2626"
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    if (positive) {
      gradient.addColorStop(0, "rgba(22, 163, 74, 0.2)")
      gradient.addColorStop(1, "rgba(22, 163, 74, 0)")
    } else {
      gradient.addColorStop(0, "rgba(220, 38, 38, 0.2)")
      gradient.addColorStop(1, "rgba(220, 38, 38, 0)")
    }

    ctx.fillStyle = gradient
    ctx.fill()
  }, [data, height, positive])

  return <canvas ref={canvasRef} width="100%" height={height} className="w-full" style={{ height: `${height}px` }} />
}

