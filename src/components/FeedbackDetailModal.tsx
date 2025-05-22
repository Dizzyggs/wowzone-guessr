import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Box
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <MotionModalContent
        bg="rgba(10, 15, 28, 0.95)"
        p={6}
        border="2px solid"
        borderColor="blue.400"
        boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <ModalHeader fontSize="2xl" p={0} mb={4}>
          <HStack justify="space-between" align="center">
            <Badge
              colorScheme={getStatusColor(feedback.status)}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="md"
            >
              {feedback.status}
            </Badge>
            <Text fontSize="sm" color="whiteAlpha.700">
              {feedback.timestamp.toLocaleDateString()} {feedback.timestamp.toLocaleTimeString()}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody p={0}>
          <VStack align="stretch" spacing={6}>
            <HStack spacing={1}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  as={FaStar}
                  w={6}
                  h={6}
                  color={i < feedback.rating ? "yellow.400" : "gray.500"}
                />
              ))}
            </HStack>
            <Box>
              <Text fontSize="lg" mb={2} color="white">
                {feedback.message}
              </Text>
            </Box>
            {feedback.response && (
              <Box bg="whiteAlpha.100" p={4} borderRadius="md">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="blue.400">
                  Response:
                </Text>
                <Text>{feedback.response}</Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter p={0} mt={6}>
          <Button
            colorScheme="blue"
            onClick={onClose}
            size="lg"
            w="full"
          >
            Close
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  )
}

export default FeedbackDetailModal 