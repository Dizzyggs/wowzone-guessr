import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Text,
  Box,
  Flex,
  Icon,
  keyframes,
  VStack,
  useToken,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaArrowLeft, FaMapMarkedAlt, FaHourglassStart, FaLightbulb, FaTrophy } from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionText = motion(Text)

const glowKeyframes = keyframes`
  0% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.4); }
  50% { box-shadow: 0 0 40px rgba(66, 153, 225, 0.6); }
  100% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.4); }
`

const floatKeyframes = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const particleKeyframes = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--translate-x), var(--translate-y)) rotate(360deg); opacity: 0; }
`

interface ReadyModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
}

const ReadyModal = ({ isOpen, onClose, onStart }: ReadyModalProps) => {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [blue400] = useToken('colors', ['blue.400'])

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isCountingDown && countdown === 0) {
      setTimeout(onStart, 500)
    }
  }, [isCountingDown, countdown])

  const handleStart = () => {
    setIsCountingDown(true)
  }

  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (360 / count) * i
      const distance = Math.random() * 100 + 50
      const x = Math.cos((angle * Math.PI) / 180) * distance
      const y = Math.sin((angle * Math.PI) / 180) * distance
      return (
        <Box
          key={i}
          position="absolute"
          top="50%"
          left="50%"
          width="4px"
          height="4px"
          borderRadius="full"
          bg="blue.400"
          sx={{
            '--translate-x': `${x}px`,
            '--translate-y': `${y}px`,
          }}
          animation={`${particleKeyframes} 1s ease-out forwards`}
        />
      )
    })
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
    >
      <ModalOverlay 
        backdropFilter="blur(12px)"
        bg="rgba(0, 0, 0, 0.7)"
      />
      <ModalContent
        bg="rgba(13, 19, 35, 0.97)"
        borderRadius={{ base: "xl", md: "3xl" }}
        border="2px solid"
        borderColor="blue.400"
        boxShadow={`0 0 40px ${blue400}40`}
        overflow="hidden"
        position="relative"
        py={{ base: 4, md: 8 }}
        mx={{ base: 4, md: 0 }}
        maxW={{ base: "90vw", md: "xl" }}
      >
        <AnimatePresence mode="wait">
          {!isCountingDown ? (
            <ModalBody key="ready" py={{ base: 4, md: 8 }}>
              <VStack spacing={{ base: 4, md: 8 }}>
                <MotionBox
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon 
                    as={FaMapMarkedAlt} 
                    color="blue.400"
                    w={{ base: 12, md: 20 }} 
                    h={{ base: 12, md: 20 }}
                    animation={`${floatKeyframes} 3s ease-in-out infinite`}
                  />
                </MotionBox>

                <MotionText
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="bold"
                  color="white"
                  textAlign="center"
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                >
                  Ready to Test Your Knowledge?
                </MotionText>

                <MotionFlex
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  gap={{ base: 3, md: 8 }}
                  justify="center"
                  wrap="wrap"
                >
                  {[
                    { icon: FaHourglassStart, text: "Beat the Clock", color: "purple.400" },
                    { icon: FaLightbulb, text: "Test Your Skills", color: "yellow.400" },
                    { icon: FaTrophy, text: "Score Points", color: "green.400" }
                  ].map((item, index) => (
                    <Box
                      key={index}
                      textAlign="center"
                      p={{ base: 2, md: 4 }}
                      borderRadius="xl"
                      bg="whiteAlpha.100"
                      backdropFilter="blur(8px)"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-2px)",
                        bg: "whiteAlpha.200"
                      }}
                    >
                      <Icon 
                        as={item.icon} 
                        w={{ base: 6, md: 8 }} 
                        h={{ base: 6, md: 8 }} 
                        color={item.color} 
                        mb={{ base: 2, md: 3 }}
                      />
                      <Text color="gray.200" fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                        {item.text}
                      </Text>
                    </Box>
                  ))}
                </MotionFlex>

                <MotionFlex
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  direction="column"
                  gap={{ base: 2, md: 4 }}
                  w="full"
                  px={{ base: 4, md: 8 }}
                  mt={{ base: 2, md: 4 }}
                >
                  <Button
                    leftIcon={<FaPlay />}
                    colorScheme="blue"
                    size={{ base: "md", md: "lg" }}
                    h="60px"
                    fontSize="xl"
                    onClick={handleStart}
                    position="relative"
                    overflow="hidden"
                    animation={`${glowKeyframes} 2s infinite`}
                    _hover={{
                      transform: 'translateY(-2px)',
                    }}
                    _active={{
                      transform: 'translateY(1px)',
                    }}
                  >
                    Start Game
                  </Button>
                  <Button
                    leftIcon={<FaArrowLeft />}
                    variant="ghost"
                    color="white"
                    onClick={onClose}
                    _hover={{
                      bg: 'whiteAlpha.100',
                    }}
                  >
                    Go Back
                  </Button>
                </MotionFlex>
              </VStack>
            </ModalBody>
          ) : (
            <ModalBody 
              key="countdown" 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              minH="400px"
              position="relative"
            >
              <AnimatePresence mode="wait">
                <MotionFlex
                  key={countdown}
                  position="relative"
                  align="center"
                  justify="center"
                  direction="column"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 1.2, 1],
                    opacity: [0, 1, 1]
                  }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  {countdown === 0 ? (
                    <>
                      <Text
                        fontSize="6xl"
                        fontWeight="black"
                        bgGradient="linear(to-r, green.400, teal.400)"
                        bgClip="text"
                        textShadow="0 0 40px rgba(72, 187, 120, 0.6)"
                      >
                        GO!
                      </Text>
                      {generateParticles(12)}
                    </>
                  ) : (
                    <>
                      <MotionBox
                        position="absolute"
                        width="200px"
                        height="200px"
                        borderRadius="full"
                        border="4px solid"
                        borderColor={countdown === 1 ? "red.400" : "blue.400"}
                        initial={{ scale: 1, opacity: 0.2 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "easeOut"
                        }}
                      />
                      <Text
                        fontSize="8xl"
                        fontWeight="black"
                        color={countdown === 1 ? "red.400" : "blue.400"}
                        textShadow={`0 0 40px ${countdown === 1 ? 'rgba(245, 101, 101, 0.6)' : 'rgba(66, 153, 225, 0.6)'}`}
                      >
                        {countdown}
                      </Text>
                    </>
                  )}
                </MotionFlex>
              </AnimatePresence>
            </ModalBody>
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default ReadyModal 