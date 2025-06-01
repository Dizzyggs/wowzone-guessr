import { useEffect, useRef, useCallback } from 'react'
import type { FC } from 'react'
import { Box } from '@chakra-ui/react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  glowSize: number
}

interface AmbientParticlesProps {
  color: string
}

const AmbientParticles: FC<AmbientParticlesProps> = ({ color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  // Convert hex to rgb
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 49, g: 130, b: 206 } // Default to #3182ce
  }, [])

  // Create particles function
  const createParticles = useCallback((width: number, height: number, rgbString: string) => {
    const particles: Particle[] = []
    const numParticles = Math.min(Math.floor((width * height) / 20000), 100)

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: rgbString,
        glowSize: Math.random() * 10 + 5
      })
    }

    return particles
  }, [])

  // Animation setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const rgb = hexToRgb(color)
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height, rgbString)
    }

    const animate = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap particles around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw glow
        ctx.save()
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.shadowColor = `rgba(${particle.color}, ${particle.opacity * 0.5})`
        ctx.shadowBlur = particle.glowSize * 2
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity * 0.3})`
        ctx.fill()
        ctx.restore()

        // Draw core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`
        ctx.fill()

        // Draw bright center
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${Math.min(particle.opacity * 2, 1)})`
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [color, hexToRgb, createParticles])

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pointerEvents="none"
      zIndex={0}
      opacity={0.8}
      sx={{
        mixBlendMode: "screen"
      }}
    />
  )
}

export default AmbientParticles 