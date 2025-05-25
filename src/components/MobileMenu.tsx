import { useRef } from 'react'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { FaBars, FaGamepad, FaTrophy, FaComments, FaHistory } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const MobileMenu = () => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuButton
        ref={menuButtonRef}
        as={IconButton}
        aria-label="Menu"
        icon={<Icon as={FaBars} />}
        variant="ghost"
        color="white"
        onClick={onOpen}
        _hover={{
          bg: "whiteAlpha.200"
        }}
      />
      <MenuList
        bg="rgba(10, 15, 28, 0.95)"
        border="2px solid"
        borderColor="purple.500"
        py={2}
        zIndex={1000}
      >
        <MenuItem
          py={3}
          bg="rgba(0, 0, 0, 0.2)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 15px rgba(66, 153, 225, 0.4)'
          }}
          onClick={() => handleNavigation('/play')}
          icon={<Icon as={FaGamepad} color="blue.400" />}
          fontSize="lg"
          color="white"
        >
          Play Now
        </MenuItem>
        <MenuItem
          py={3}
          bg="rgba(0, 0, 0, 0.2)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 15px rgba(147, 51, 234, 0.4)'
          }}
          onClick={() => handleNavigation('/leaderboard')}
          icon={<Icon as={FaTrophy} color="purple.400" />}
          fontSize="lg"
          color="white"
        >
          Leaderboard
        </MenuItem>
        <MenuItem
          py={3}
          bg="rgba(0, 0, 0, 0.2)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 15px rgba(236, 201, 75, 0.4)'
          }}
          onClick={() => handleNavigation('/changelog')}
          icon={<Icon as={FaHistory} color="yellow.400" />}
          fontSize="lg"
          color="white"
        >
          Changelog
        </MenuItem>
        <MenuItem
          py={3}
          bg="rgba(0, 0, 0, 0.2)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 15px rgba(66, 153, 225, 0.4)'
          }}
          onClick={() => handleNavigation('/feedback')}
          icon={<Icon as={FaComments} color="blue.400" />}
          fontSize="lg"
          color="white"
        >
          Feedback
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default MobileMenu 