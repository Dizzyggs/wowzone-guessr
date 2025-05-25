import { useState, useEffect } from 'react'

export const useZoomLevel = () => {
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    const detectZoom = () => {
      // Get the device pixel ratio
      const ratio = Math.round((window.devicePixelRatio + Number.EPSILON) * 100) / 100
      setZoomLevel(ratio)
    }

    // Detect initial zoom
    detectZoom()

    // Add listeners for zoom changes
    window.addEventListener('resize', detectZoom)
    
    // Some browsers trigger this event on zoom
    window.visualViewport?.addEventListener('resize', detectZoom)

    return () => {
      window.removeEventListener('resize', detectZoom)
      window.visualViewport?.removeEventListener('resize', detectZoom)
    }
  }, [])

  return zoomLevel
} 