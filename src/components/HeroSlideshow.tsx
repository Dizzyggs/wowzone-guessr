import { useState, useEffect } from 'react'
import { Box, Image, Spinner } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { preloadImagePaths } from '../utils/imagePreloader'

const MotionBox = motion(Box)

const slides = [
  'slide_imgs/slide_img1.png',
  'slide_imgs/slide_img2.jpg',
  'slide_imgs/slide_img3.jpg',
  'slide_imgs/slide_img4.jpg',
  'slide_imgs/slide_img5.jpg',
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Preload all slides when component mounts
    const loadImages = async () => {
      setIsLoading(true)
      await preloadImagePaths(slides)
      setIsLoading(false)
    }
    loadImages()

    const timer = setInterval(() => {
      // Only advance if current image is loaded
      if (imagesLoaded[slides[currentSlide]]) {
        const nextSlide = (currentSlide + 1) % slides.length
        setDirection(1)
        setCurrentSlide(nextSlide)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide, imagesLoaded])

  const handleImageLoad = (src: string) => {
    setImagesLoaded(prev => ({ ...prev, [src]: true }))
  }

  const paginate = (newDirection: number) => {
    // Only allow pagination if current image is loaded
    if (imagesLoaded[slides[currentSlide]]) {
      const nextSlide = (currentSlide + newDirection + slides.length) % slides.length
      setDirection(newDirection)
      setCurrentSlide(nextSlide)
    }
  }

  return (
    <Box
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        bg: 'blue.500',
        filter: 'blur(20px)',
        opacity: 0.2,
        borderRadius: 'xl',
        zIndex: -1,
      }}
      h={{ base: "250px", sm: "300px", md: "400px" }}
      overflow="hidden"
      borderRadius="xl"
    >
      {isLoading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={2}
        >
          <Spinner size="xl" color="blue.400" />
        </Box>
      )}
      <AnimatePresence
        initial={false}
        mode="wait"
        custom={direction}
      >
        <MotionBox
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          transition={{
            x: { type: "tween", duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
        >
          <Image
            src={slides[currentSlide]}
            alt={`World of Warcraft Landscape ${currentSlide + 1}`}
            objectFit="cover"
            objectPosition="center"
            w="full"
            h="full"
            loading="eager"
            onLoad={() => handleImageLoad(slides[currentSlide])}
            opacity={imagesLoaded[slides[currentSlide]] ? 1 : 0}
            transition="opacity 0.3s"
          />
        </MotionBox>
      </AnimatePresence>
    </Box>
  )
}

export default HeroSlideshow 