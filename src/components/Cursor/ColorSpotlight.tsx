import { useEffect, useRef } from 'react'

export default function ColorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spot = spotRef.current
    if (!spot) return

    let x = 0
    let y = 0
    let currentX = 0
    let currentY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const animate = () => {
      currentX += (x - currentX) * 0.15
      currentY += (y - currentY) * 0.15
      spot.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed top-0 left-0 z-50 w-[600px] h-[600px] rounded-full opacity-20 mix-blend-screen blur-[80px]"
      style={{
        background: 'radial-gradient(circle, #a78bfa 0%, #6d28d9 30%, transparent 70%)',
      }}
    />
  )
}
