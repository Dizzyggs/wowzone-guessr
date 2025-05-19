import { Box, Button, Container, Heading, Text, VStack, Flex, Icon, HStack, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaGamepad, FaMapMarkedAlt, FaTrophy, FaCompass, FaQuestionCircle } from 'react-icons/fa'
import HeroSlideshow from '../components/HeroSlideshow'
import { HowToPlayGuide } from '../components/HowToPlayGuide'

const Home = () => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 20 }}>
      <Flex 
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="space-between"
        gap={{ base: 6, lg: 10 }}
      >
        <VStack 
          align={{ base: "center", lg: "flex-start" }}
          spacing={{ base: 4, lg: 6 }}
          flex={1}
          textAlign={{ base: "center", lg: "left" }}
        >
          <Heading
            as="h1"
            size={{ base: "xl", md: "2xl" }}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            display="flex"
            alignItems="center"
            gap={4}
            flexDir={{ base: "column", sm: "row" }}
          >
            <Icon as={FaMapMarkedAlt} w={{ base: 8, md: 12 }} h={{ base: 8, md: 12 }} color="blue.400" />
            Test Your World of Warcraft Knowledge
          </Heading>
          
          <VStack align={{ base: "center", lg: "stretch" }} spacing={4} width="full">
            <HStack spacing={4} color="gray.300" justify={{ base: "center", lg: "flex-start" }}>
              <Icon as={FaCompass} w={6} h={6} color="blue.400" />
              <Text fontSize={{ base: "lg", xl: "xl" }}>
                Challenge yourself to identify locations within WoW Vanilla and TBC.
              </Text>
            </HStack>
            <HStack spacing={4} color="gray.300" justify={{ base: "center", lg: "flex-start" }}>
              <Icon as={FaTrophy} w={6} h={6} color="purple.500" />
              <Text fontSize={{ base: "lg", xl: "xl" }}>
                Compete with others and climb the leaderboard rankings.
              </Text>
            </HStack>
          </VStack>
          
          <HStack spacing={4}>
            <Button
              size={{ base: "md", md: "lg" }}
              colorScheme="blue"
              onClick={() => navigate('/play')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={FaGamepad} w={6} h={6} />}
            >
              Start Playing
            </Button>
            <Button
              size={{ base: "md", md: "lg" }}
              variant="outline"
              colorScheme="purple"
              onClick={onOpen}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={FaQuestionCircle} w={6} h={6} />}
            >
              How to Play
            </Button>
          </HStack>
        </VStack>

        <Box flex={1} w="full">
          <HeroSlideshow />
        </Box>
      </Flex>

      <HowToPlayGuide isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}

export default Home 