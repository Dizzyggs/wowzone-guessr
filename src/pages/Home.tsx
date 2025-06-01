import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Flex, 
  Icon, 
  HStack, 
  useDisclosure,
  keyframes,
  useBreakpointValue
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaGamepad, FaTrophy, FaCompass, FaQuestionCircle } from 'react-icons/fa'
import HeroSlideshow from '../components/HeroSlideshow'
import { HowToPlayGuide } from '../components/HowToPlayGuide'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionText = motion(Text)



const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.4); }
  50% { box-shadow: 0 0 40px rgba(66, 153, 225, 0.6); }
  100% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.4); }
`

const Home = () => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, lg: false })

  return (
    <Box 
      position="relative" 
      minH="calc(100vh - 100px)"
      overflow="hidden"
    >
      {/* Background Spotlight Effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at center, rgba(66, 153, 225, 0.08) 0%, rgba(66, 153, 225, 0.05) 25%, rgba(10, 15, 28, 0.99) 50%, rgba(10, 15, 28, 1) 100%)"
        pointerEvents="none"
        zIndex={0}
      />

      <Container maxW="container.xl" py={{ base: 6, md: 20 }} position="relative" zIndex={2}>
        <MotionFlex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 6, lg: 20 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Content */}
          <VStack 
            align={{ base: "center", lg: "flex-start" }}
            spacing={{ base: 4, lg: 8 }}
            flex={1}
            textAlign={{ base: "center", lg: "left" }}
            px={{ base: 4, md: 0 }}
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
                lineHeight="1.2"
                mb={{ base: 2, md: 4 }}
              >
                Master Your
                <br />
                Azeroth Knowledge
              </Heading>
            </MotionBox>

            <MotionText
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              color="gray.300"
              maxW="600px"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              px={{ base: 2, md: 0 }}
            >
              Put your knowledge to the test through World of Warcraft's most iconic locations. Test your expertise, compete with others, and become a true master of Azeroth's landscapes.
            </MotionText>

            <VStack align={{ base: "stretch", lg: "stretch" }} spacing={{ base: 3, md: 6 }} width="full" px={isMobile ? 4: 0}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <HStack 
                  spacing={{ base: 3, md: 4 }} 
                  color="gray.300" 
                  justify={{ base: "flex-start", lg: "flex-start" }}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(8px)"
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  transition="all 0.3s"
                  _hover={{
                    bg: "whiteAlpha.200",
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                >
                  <Icon as={FaCompass} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} color="blue.400" />
                  <Text fontSize={{ base: "sm", sm: "md", xl: "lg" }}>
                    Challenge yourself with locations from Classic and TBC
                  </Text>
                </HStack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <HStack 
                  spacing={{ base: 3, md: 4 }} 
                  color="gray.300" 
                  justify={{ base: "flex-start", lg: "flex-start" }}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(8px)"
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  transition="all 0.3s"
                  _hover={{
                    bg: "whiteAlpha.200",
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                >
                  <Icon as={FaTrophy} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} color="purple.500" />
                  <Text fontSize={{ base: "sm", sm: "md", xl: "lg" }}>
                    Climb the global rankings and prove your mastery
                  </Text>
                </HStack>
              </MotionBox>
            </VStack>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              w={{ base: "full", md: "auto" }}
            >
              <HStack spacing={4} justify={{ base: "stretch", md: "flex-start" }} w="full" border="1px solid red">
                <Button
                  size={{ base: "md", md: "lg" }}
                  px={{ base: 6, md: 8 }}
                  py={{ base: 6, md: 7 }}
                  colorScheme="blue"
                  onClick={() => navigate('/play')}
                  position="relative"
                  overflow="hidden"
                  flex={{ base: 1, md: "initial" }}
                  fontSize={{ base: "md", md: "lg" }}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                    transform: "translateX(-100%)",
                    transition: "transform 0.6s",
                  }}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                    _before: {
                      transform: "translateX(100%)",
                    }
                  }}
                  animation={`${glowAnimation} 2s infinite`}
                >
                  <Icon as={FaGamepad} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} mr={2} />
                  Start Playing
                </Button>
                <Button
                  size={{ base: "lg", md: "xl" }}
                  px={8}
                  py={7}
                  variant="outline"
                  colorScheme="purple"
                  onClick={onOpen}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: 'whiteAlpha.100'
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={FaQuestionCircle} w={6} h={6} mr={2} />
                  How to Play
                </Button>
              </HStack>
            </MotionBox>
          </VStack>

          {/* Right Content */}
          <MotionBox
            flex={1}
            w="full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
              _before={{
                content: '""',
                position: "absolute",
                top: "-2px",
                right: "-2px",
                bottom: "-2px",
                left: "-2px",
                background: "linear-gradient(45deg, blue.400, purple.500)",
                zIndex: -1,
                borderRadius: "2xl",
              }}
            >
              <HeroSlideshow />
            </Box>
          </MotionBox>
        </MotionFlex>
      </Container>

      <HowToPlayGuide isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Home 