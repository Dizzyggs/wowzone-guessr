import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Tag,
  Box,
  Flex,
  IconButton,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaStar, FaTimes, FaClock, FaCheck, FaRegClock } from 'react-icons/fa'

const MotionModalContent = motion(ModalContent)

interface FeedbackDetailModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: {
    message: string
    rating: number
    timestamp: Date
    status: 'new' | 'in-progress' | 'completed'
    response?: string
  }
}

const FeedbackDetailModal = ({ isOpen, onClose, feedback }: FeedbackDetailModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue'
      case 'in-progress': return 'yellow'
      case 'completed': return 'green'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return FaClock
      case 'in-progress': return FaRegClock
      case 'completed': return FaCheck
      default: return FaClock
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    return 'Just now'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <MotionModalContent
        bg="rgba(13, 16, 33, 0.95)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="dark-lg"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        mx={4}
        overflow="hidden"
      >
        {/* Header with close button */}
        <Flex 
          justify="space-between" 
          align="center" 
          p={6} 
          pb={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <VStack align="start" spacing={2}>
            <Tag
              size="lg"
              variant="subtle"
              colorScheme={getStatusColor(feedback.status)}
              borderRadius="full"
              px={4}
              py={2}
            >
              <Icon as={getStatusIcon(feedback.status)} mr={2} />
              {feedback.status}
            </Tag>
            <Text fontSize="sm" color="whiteAlpha.600">
              Submitted {getTimeAgo(feedback.timestamp)}
            </Text>
          </VStack>
          <IconButton
            aria-label="Close modal"
            icon={<FaTimes />}
            onClick={onClose}
            variant="ghost"
            color="whiteAlpha.600"
            _hover={{ color: "white", bg: "whiteAlpha.100" }}
          />
        </Flex>

        <ModalBody p={6}>
          <VStack align="stretch" spacing={6}>
            {/* Rating */}
            <Box 
              bg="whiteAlpha.50" 
              p={4} 
              borderRadius="xl"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-50%"
                left="-50%"
                width="200%"
                height="200%"
                background="radial-gradient(circle, rgba(236, 201, 75, 0.1) 0%, transparent 70%)"
                pointerEvents="none"
              />
              <VStack align="start" spacing={2}>
                <Text color="whiteAlpha.700" fontSize="sm">Rating</Text>
                <HStack spacing={2}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      as={FaStar}
                      w={6}
                      h={6}
                      color={i < feedback.rating ? "yellow.400" : "whiteAlpha.200"}
                    />
                  ))}
                </HStack>
              </VStack>
            </Box>

            {/* Message */}
            <Box>
              <Text color="whiteAlpha.700" fontSize="sm" mb={2}>
                Feedback Message
              </Text>
              <Text 
                fontSize="lg" 
                color="white"
                lineHeight="tall"
              >
                {feedback.message}
              </Text>
            </Box>

            {/* Response */}
            {feedback.response && (
              <Box
                bg="whiteAlpha.50"
                p={6}
                borderRadius="xl"
                borderLeft="4px solid"
                borderColor="blue.400"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  width="200%"
                  height="200%"
                  background="radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, transparent 70%)"
                  pointerEvents="none"
                />
                <VStack align="stretch" spacing={3}>
                  <Text color="blue.400" fontSize="sm" fontWeight="bold">
                    Official Response
                  </Text>
                  <Text color="white">
                    {feedback.response}
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter 
          p={6} 
          pt={4}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Button
            onClick={onClose}
            size="lg"
            width="full"
            bg="whiteAlpha.100"
            _hover={{ bg: "whiteAlpha.200" }}
            _active={{ bg: "whiteAlpha.300" }}
          >
            Close
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  )
}

export default FeedbackDetailModal 