import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  // useBreakpointValue,
  // keyframes,
  Button,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaKeyboard, FaTrophy, FaGamepad, FaStar, FaBolt, FaHourglassStart } from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

// const pulseKeyframes = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `

// const floatKeyframes = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// `

const GameModeSelect = () => {
  const navigate = useNavigate()
  // const isMobile = useBreakpointValue({ base: true, md: false })

  const handleEasyMode = () => {
    navigate('/play/easy')
  }

  const handleHardMode = () => {
    navigate('/play/hard')
  }

  return (
    <Box
      position="relative"
      minH="calc(100vh - 200px)"
      overflow="hidden"
      py={{ base: 8, md: 16 }}
    >
      {/* Background Spotlight Effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at center, rgba(66, 153, 225, 0.15) 0%, rgba(66, 153, 225, 0.08) 35%, rgba(10, 15, 28, 1) 70%)"
        pointerEvents="none"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={{ base: 8, md: 16 }}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <MotionHeading
              fontSize={{ base: "4xl", md: "6xl" }}
              bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
              mb={6}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              Choose Your Challenge
            </MotionHeading>
            <MotionText 
              fontSize={{ base: "lg", md: "xl" }} 
              color="gray.400"
              maxW="2xl"
              mx="auto"
            >
              Test your knowledge of Azeroth's landscapes in two distinct challenges. 
              Each mode offers a unique way to prove your mastery of World of Warcraft's geography.
            </MotionText>
          </MotionBox>

          <SimpleGrid 
            columns={{ base: 1, lg: 2 }} 
            spacing={{ base: 8, lg: 12 }} 
            w="full" 
            maxW="1200px"
            mx="auto"
          >
            {/* Multiple Choice Mode */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onClick={handleEasyMode}
              cursor="pointer"
            >
              <Box
                bg="rgba(13, 16, 33, 0.7)"
                backdropFilter="blur(16px)"
                borderRadius="3xl"
                p={{ base: 6, md: 8 }}
                position="relative"
                overflow="hidden"
                border="1px solid"
                borderColor="blue.400"
                transition="all 0.3s"
                role="group"
                _hover={{
                  borderColor: "blue.300",
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(66, 153, 225, 0.3)",
                }}
              >
                {/* Glow Effect */}
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  width="200%"
                  height="200%"
                  background="radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, transparent 70%)"
                  opacity="0"
                  transition="opacity 0.3s"
                  _groupHover={{ opacity: "1" }}
                  pointerEvents="none"
                />

                <VStack spacing={6} align="flex-start">
                  <Box
                    p={4}
                    borderRadius="2xl"
                    bg="blue.400"
                    color="white"
                    transform="rotate(-5deg)"
                    _groupHover={{
                      transform: "rotate(0deg)",
                    }}
                    transition="transform 0.3s"
                  >
                    <Icon as={FaGamepad} w={8} h={8} />
                  </Box>

                  <VStack align="flex-start" spacing={4}>
                    <Heading size="lg" color="white">Multiple Choice</Heading>
                    <Text color="gray.300" fontSize="lg">
                      Perfect for beginners! Choose from four options and test your knowledge with guided choices.
                    </Text>
                  </VStack>

                  <SimpleGrid columns={2} spacing={4} w="full">
                    <Box
                      p={4}
                      bg="whiteAlpha.100"
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Icon as={FaBolt} w={5} h={5} color="blue.300" mb={2} />
                      <Text color="gray.300" fontSize="sm">Quick Rounds</Text>
                    </Box>
                    <Box
                      p={4}
                      bg="whiteAlpha.100"
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Icon as={FaStar} w={5} h={5} color="yellow.300" mb={2} />
                      <Text color="gray.300" fontSize="sm">100pts/correct</Text>
                    </Box>
                  </SimpleGrid>

                  <Button
                    size="lg"
                    w="full"
                    colorScheme="blue"
                    _groupHover={{
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    Start Multiple Choice
                  </Button>
                </VStack>
              </Box>
            </MotionBox>

            {/* Manual Input Mode */}
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onClick={handleHardMode}
              cursor="pointer"
            >
              <Box
                bg="rgba(13, 16, 33, 0.7)"
                backdropFilter="blur(16px)"
                borderRadius="3xl"
                p={{ base: 6, md: 8 }}
                position="relative"
                overflow="hidden"
                border="1px solid"
                borderColor="purple.500"
                transition="all 0.3s"
                role="group"
                _hover={{
                  borderColor: "purple.400",
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(159, 122, 234, 0.3)",
                }}
              >
                {/* Glow Effect */}
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  width="200%"
                  height="200%"
                  background="radial-gradient(circle, rgba(159, 122, 234, 0.15) 0%, transparent 70%)"
                  opacity="0"
                  transition="opacity 0.3s"
                  _groupHover={{ opacity: "1" }}
                  pointerEvents="none"
                />

                <VStack spacing={6} align="flex-start">
                  <Box
                    p={4}
                    borderRadius="2xl"
                    bg="purple.500"
                    color="white"
                    transform="rotate(-5deg)"
                    _groupHover={{
                      transform: "rotate(0deg)",
                    }}
                    transition="transform 0.3s"
                  >
                    <Icon as={FaKeyboard} w={8} h={8} />
                  </Box>

                  <VStack align="flex-start" spacing={4}>
                    <Heading size="lg" color="white">Manual Input</Heading>
                    <Text color="gray.300" fontSize="lg">
                      For true veterans! Type in zone names manually and prove your expertise without hints.
                    </Text>
                  </VStack>

                  <SimpleGrid columns={2} spacing={4} w="full">
                    <Box
                      p={4}
                      bg="whiteAlpha.100"
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Icon as={FaHourglassStart} w={5} h={5} color="purple.300" mb={2} />
                      <Text color="gray.300" fontSize="sm">Two Lives</Text>
                    </Box>
                    <Box
                      p={4}
                      bg="whiteAlpha.100"
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Icon as={FaTrophy} w={5} h={5} color="yellow.300" mb={2} />
                      <Text color="gray.300" fontSize="sm">150pts/correct</Text>
                    </Box>
                  </SimpleGrid>

                  <Button
                    size="lg"
                    w="full"
                    colorScheme="purple"
                    _groupHover={{
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    Start Manual Input
                  </Button>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default GameModeSelect