import { useState, useEffect } from 'react'
import { Box, Image, Spinner, IconButton, Flex, useBreakpointValue } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { preloadImagePaths } from '../utils/imagePreloader'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionImage = motion(Image)

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
    opacity: 0.5,
    scale: 0.98,
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0.5,
    scale: 0.98,
    zIndex: 0,
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
  const [isHovered, setIsHovered] = useState(false)
  const showControls = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true)
      await preloadImagePaths(slides)
      setIsLoading(false)
    }
    loadImages()

    const timer = setInterval(() => {
      if (!isHovered && imagesLoaded[slides[currentSlide]]) {
        const nextSlide = (currentSlide + 1) % slides.length
        setDirection(1)
        setCurrentSlide(nextSlide)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide, imagesLoaded, isHovered])

  const handleImageLoad = (src: string) => {
    setImagesLoaded(prev => ({ ...prev, [src]: true }))
  }

  const paginate = (newDirection: number) => {
    if (imagesLoaded[slides[currentSlide]]) {
      const nextSlide = (currentSlide + newDirection + slides.length) % slides.length
      setDirection(newDirection)
      setCurrentSlide(nextSlide)
    }
  }

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      h={{ base: "300px", sm: "400px", md: "500px" }}
      overflow="hidden"
      borderRadius="xl"
    >
      {isLoading && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          bg="rgba(0, 0, 0, 0.4)"
          backdropFilter="blur(8px)"
          zIndex={2}
        >
          <Spinner size="xl" color="blue.400" thickness="4px" />
        </Flex>
      )}

      <AnimatePresence
        initial={false}
        mode="sync"
        custom={direction}
      >
        <MotionImage
          key={currentSlide}
          src={slides[currentSlide]}
          alt={`World of Warcraft Screenshot ${currentSlide + 1}`}
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
          width="100%"
          height="100%"
          objectFit="cover"
          onLoad={() => handleImageLoad(slides[currentSlide])}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
          onDragEnd={(_e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
        />
      </AnimatePresence>

      {/* Navigation Controls */}
      <Flex
        position="absolute"
        bottom={4}
        left={0}
        right={0}
        justify="center"
        gap={2}
        opacity={showControls || isHovered ? 1 : 0}
        transition="opacity 0.3s"
        zIndex={1}
      >
        <IconButton
          aria-label="Previous slide"
          icon={<FaChevronLeft />}
          onClick={() => paginate(-1)}
          variant="solid"
          colorScheme="blackAlpha"
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(8px)"
          size="lg"
          rounded="full"
          _hover={{
            bg: "rgba(0, 0, 0, 0.8)",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        />
        <IconButton
          aria-label="Next slide"
          icon={<FaChevronRight />}
          onClick={() => paginate(1)}
          variant="solid"
          colorScheme="blackAlpha"
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(8px)"
          size="lg"
          rounded="full"
          _hover={{
            bg: "rgba(0, 0, 0, 0.8)",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        />
      </Flex>

      {/* Progress Indicators */}
      <Flex
        position="absolute"
        bottom={4}
        left={0}
        right={0}
        justify="center"
        gap={2}
        zIndex={1}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            w={2}
            h={2}
            borderRadius="full"
            bg={currentSlide === index ? "blue.400" : "whiteAlpha.400"}
            transition="all 0.3s"
            transform={currentSlide === index ? "scale(1.5)" : "scale(1)"}
            cursor="pointer"
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1)
              setCurrentSlide(index)
            }}
            _hover={{
              bg: currentSlide === index ? "blue.300" : "whiteAlpha.600"
            }}
          />
        ))}
      </Flex>

      {/* Image Overlay Gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="30%"
        bgGradient="linear(to-t, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
        pointerEvents="none"
      />
    </Box>
  )
}

export default HeroSlideshow 