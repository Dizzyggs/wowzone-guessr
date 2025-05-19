import { useState, useEffect } from 'react'
import { Box, Image } from '@chakra-ui/react'
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
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 1.05,
  }),
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    // Preload all slides when component mounts
    preloadImagePaths(slides)

    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length
      setDirection(1)
      setCurrentSlide(nextSlide)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide])

  const paginate = (newDirection: number) => {
    const nextSlide = (currentSlide + newDirection + slides.length) % slides.length
    setDirection(newDirection)
    setCurrentSlide(nextSlide)
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
            x: { type: "spring", stiffness: 400, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
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
          />
        </MotionBox>
      </AnimatePresence>
    </Box>
  )
}

export default HeroSlideshow 