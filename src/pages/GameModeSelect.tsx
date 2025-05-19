import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaQuestionCircle, FaKeyboard, FaTrophy } from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)

const GameModeSelect = () => {
  const navigate = useNavigate()

  const handleEasyMode = () => {
    navigate('/play/easy')
  }

  const handleHardMode = () => {
    navigate('/play/hard')
  }

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={12}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading
            fontSize="5xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            mb={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Icon as={FaTrophy} w={12} h={12} color="blue.400" />
            Choose Your Challenge
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Test your knowledge of Azeroth's landscapes
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
          <MotionBox
            whileHover={{ 
              scale: 1.02,
              y: -8,
              transition: { 
                type: "spring",
                stiffness: 400,
                damping: 15
              }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEasyMode}
          >
            <Box
              bg="rgba(10, 15, 28, 0.95)"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              textAlign="center"
              border="2px solid"
              borderColor="blue.400"
              transition="all 0.3s"
              position="relative"
              role="group"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'xl',
                bg: 'blue.400',
                opacity: 0,
                transform: 'scale(0.8)',
                transition: 'all 0.3s',
                filter: 'blur(20px)',
                zIndex: -1,
              }}
              _hover={{
                borderColor: 'blue.300',
                boxShadow: '0 8px 20px -8px rgba(66, 153, 225, 0.5)',
                _before: {
                  opacity: 0.15,
                  transform: 'scale(1)',
                }
              }}
            >
              <Icon 
                as={FaQuestionCircle} 
                w={12} 
                h={12} 
                color="blue.400" 
                mb={4}
                transition="transform 0.3s"
                _groupHover={{ transform: 'rotate(180deg)' }}
              />
              <MotionHeading 
                size="lg" 
                mb={4}
                transition="all 0.3s"
                _groupHover={{ scale: 1.1 }}
              >
                Multiple Choice
              </MotionHeading>
              <Text color="gray.400">
                Choose from 4 possible answers. Perfect for beginners!
                Test your knowledge with guided options.
              </Text>
            </Box>
          </MotionBox>

          <MotionBox
            whileHover={{ 
              scale: 1.02,
              y: -8,
              transition: { 
                type: "spring",
                stiffness: 400,
                damping: 15
              }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHardMode}
          >
            <Box
              bg="rgba(10, 15, 28, 0.95)"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              textAlign="center"
              border="2px solid"
              borderColor="purple.500"
              transition="all 0.3s"
              position="relative"
              role="group"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'xl',
                bg: 'purple.500',
                opacity: 0,
                transform: 'scale(0.8)',
                transition: 'all 0.3s',
                filter: 'blur(20px)',
                zIndex: -1,
              }}
              _hover={{
                borderColor: 'purple.400',
                boxShadow: '0 8px 20px -8px rgba(159, 122, 234, 0.5)',
                _before: {
                  opacity: 0.15,
                  transform: 'scale(1)',
                }
              }}
            >
              <Icon 
                as={FaKeyboard} 
                w={12} 
                h={12} 
                color="purple.500" 
                mb={4}
                transition="transform 0.3s"
                _groupHover={{ transform: 'rotate(180deg)' }}
              />
              <MotionHeading 
                size="lg" 
                mb={4}
                transition="all 0.3s"
                _groupHover={{ scale: 1.1 }}
              >
                Manual Input
              </MotionHeading>
              <Text color="gray.400">
                Type in the zone name yourself. For true WoW veterans!
                No hints, just pure knowledge.
              </Text>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}

export default GameModeSelect 