import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Flex,
  Icon,
  keyframes,
  VStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaPlay, FaArrowLeft, FaHourglassStart, FaCrosshairs, FaTrophy } from 'react-icons/fa'

const MotionBox = motion(Box)

const pulseKeyframes = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.15; }
  100% { transform: scale(1); opacity: 0.3; }
`

const floatKeyframes = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

interface ReadyModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
}

const ReadyModal = ({ isOpen, onClose, onStart }: ReadyModalProps) => {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (isCountingDown && countdown === 0) {
      onStart()
    }
  }, [isCountingDown, countdown])

  const handleStart = () => {
    setIsCountingDown(true)
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="lg"
    >
      <ModalOverlay 
        backdropFilter="blur(8px)"
        bg="rgba(0, 0, 0, 0.6)"
      />
      <ModalContent
        bg="rgba(13, 19, 35, 0.95)"
        borderRadius="2xl"
        border="2px solid"
        borderColor="blue.400"
        boxShadow="0 0 40px rgba(66, 153, 225, 0.4)"
        overflow="hidden"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0) 70%)",
          animation: `${pulseKeyframes} 4s ease-in-out infinite`
        }}
      >
        {!isCountingDown ? (
          <>
            <ModalHeader
              textAlign="center"
              fontSize="3xl"
              color="white"
              fontWeight="bold"
              pt={8}
              pb={4}
            >
              <Flex justify="center" align="center" gap={3}>
                <Icon 
                  as={FaCrosshairs} 
                  color="blue.400"
                  w={8} 
                  h={8}
                  animation={`${floatKeyframes} 2s ease-in-out infinite`}
                />
                Ready to Test Your Knowledge?
              </Flex>
            </ModalHeader>

            <ModalBody py={8}>
              <VStack spacing={6}>
                <Box textAlign="center">
                  <Text color="gray.300" fontSize="lg" mb={4}>
                    Get ready to identify World of Warcraft zones!
                  </Text>
                  <Text color="blue.300" fontSize="md">
                    The timer starts when you begin. Good luck, adventurer!
                  </Text>
                </Box>

                <Flex gap={6} justify="center" mt={4}>
                  <Box textAlign="center">
                    <Icon 
                      as={FaHourglassStart} 
                      w={6} 
                      h={6} 
                      color="purple.400" 
                      mb={2}
                    />
                    <Text color="gray.400" fontSize="sm">Timer Active</Text>
                  </Box>
                  <Box textAlign="center">
                    <Icon 
                      as={FaTrophy} 
                      w={6} 
                      h={6} 
                      color="yellow.400" 
                      mb={2}
                    />
                    <Text color="gray.400" fontSize="sm">Score Points</Text>
                  </Box>
                </Flex>
              </VStack>
            </ModalBody>

            <ModalFooter
              flexDirection="column"
              gap={4}
              pb={8}
              px={8}
            >
              <Button
                leftIcon={<FaPlay />}
                colorScheme="blue"
                size="lg"
                w="full"
                h="60px"
                fontSize="xl"
                onClick={handleStart}
                transition="all 0.2s"
                bg="blue.500"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 0 20px rgba(66, 153, 225, 0.4)',
                  _before: {
                    transform: "translateX(100%)",
                  }
                }}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.5s",
                }}
              >
                Start Game
              </Button>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                color="white"
                size="lg"
                w="full"
                onClick={onClose}
                _hover={{
                  transform: 'translateY(-2px)',
                  bg: 'whiteAlpha.100',
                }}
                _active={{
                  transform: 'translateY(1px)',
                }}
                transition="all 0.2s"
              >
                Go Back
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalBody 
            py={16} 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            minH="240px"
            position="relative"
            overflow="hidden"
          >
            <MotionBox
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: [0, 1, 1]
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
              key={countdown}
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="160px"
              height="160px"
            >
              <Box
                position="absolute"
                inset="0"
                borderRadius="full"
                bg={countdown <= 3 ? "red.400" : "blue.400"}
                opacity="0.15"
              />
              <Text
                fontSize="96px"
                lineHeight="1"
                fontWeight="bold"
                color={countdown <= 3 ? "red.400" : "blue.400"}
                textShadow={`0 0 20px ${countdown <= 3 ? 'rgba(245, 101, 101, 0.4)' : 'rgba(66, 153, 225, 0.4)'}`}
                userSelect="none"
                position="relative"
              >
                {countdown}
              </Text>
            </MotionBox>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ReadyModal 