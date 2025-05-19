import { Box, Flex, Heading, Button, Container, Icon } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaGamepad, FaTrophy, FaDragon } from 'react-icons/fa'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  return (
    <Box 
      as="nav" 
      bg="rgba(10, 15, 28, 0.95)"
      backdropFilter="blur(10px)"
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <Container maxW="container.xl">
        <Flex py={4} align="center" justify="space-between">
          <Heading
            as={RouterLink}
            to="/"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            letterSpacing="tight"
            color="white"
            _hover={{
              textDecoration: 'none',
              transform: 'scale(1.05)',
            }}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaDragon} w={{ base: 6, md: 8 }} h={{ base: 6, md: 8 }} color="blue.400" />
            WoW ZoneGuesser
          </Heading>
          
          {/* Desktop Navigation */}
          <Flex gap={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              as={RouterLink}
              to="/play"
              colorScheme="blue"
              variant="solid"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={FaGamepad} w={5} h={5} />}
            >
              Play Now
            </Button>
            <Button
              as={RouterLink}
              to="/leaderboard"
              variant="ghost"
              color="white"
              _hover={{
                bg: 'whiteAlpha.200',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={FaTrophy} w={5} h={5} />}
            >
              Leaderboard
            </Button>
          </Flex>

          {/* Mobile Menu */}
          <Box display={{ base: 'block', md: 'none' }}>
            <MobileMenu />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar 