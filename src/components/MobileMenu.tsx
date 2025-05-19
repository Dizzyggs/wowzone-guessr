import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaBars, FaGamepad, FaTrophy } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'

const MobileMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Icon as={FaBars} />}
        variant="ghost"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'whiteAlpha.300' }}
        display={{ base: 'flex', md: 'none' }}
      />
      <MenuList
        bg="rgba(10, 15, 28, 0.95)"
        borderColor="purple.500"
        boxShadow="dark-lg"
        backdropFilter="blur(10px)"
        zIndex={1000}
        py={2}
        border="2px solid"
      >
        <MenuItem
          as={RouterLink}
          to="/play"
          icon={<Icon as={FaGamepad} color="blue.400" />}
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 10px rgba(66, 153, 225, 0.3)'
          }}
          _focus={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 10px rgba(66, 153, 225, 0.3)'
          }}
          bg="rgba(0, 0, 0, 0.2)"
          color="white"
          fontSize="lg"
          py={3}
          transition="all 0.2s"
        >
          Play Now
        </MenuItem>
        <MenuItem
          as={RouterLink}
          to="/leaderboard"
          icon={<Icon as={FaTrophy} color="purple.500" />}
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 10px rgba(159, 122, 234, 0.3)'
          }}
          _focus={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 10px rgba(159, 122, 234, 0.3)'
          }}
          bg="rgba(0, 0, 0, 0.2)"
          color="white"
          fontSize="lg"
          py={3}
          transition="all 0.2s"
        >
          Leaderboard
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default MobileMenu 