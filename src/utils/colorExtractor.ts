export const extractDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.crossOrigin = 'Anonymous'
    img.src = imageSrc

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve('#3182ce') // Default blue if canvas not supported
        return
      }

      // Scale down image for faster processing
      const size = 50
      canvas.width = size
      canvas.height = size
      ctx.drawImage(img, 0, 0, size, size)

      const imageData = ctx.getImageData(0, 0, size, size).data
      let r = 0, g = 0, b = 0, count = 0

      // Sample pixels and average colors
      for (let i = 0; i < imageData.length; i += 4) {
        const brightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
        if (brightness > 20) { // Skip very dark pixels
          r += imageData[i]
          g += imageData[i + 1]
          b += imageData[i + 2]
          count++
        }
      }

      if (count === 0) {
        resolve('#3182ce') // Default blue if image is too dark
        return
      }

      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)

      // Convert RGB to hex
      const toHex = (n: number) => n.toString(16).padStart(2, '0')
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`

      resolve(hex)
    }

    img.onerror = () => {
      resolve('#3182ce') // Default blue on error
    }
  })
} 