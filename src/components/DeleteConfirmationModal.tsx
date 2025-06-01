import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Icon,
  VStack,
  HStack,
  Badge,
  Box
} from '@chakra-ui/react'
import { FaExclamationTriangle } from 'react-icons/fa'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
  feedback: {
    message: string
    rating: number
    status: 'new' | 'in-progress' | 'completed'
  }
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading, 
  feedback 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent
        bg="rgba(10, 15, 28, 0.95)"
        border="2px solid"
        borderColor="red.400"
        boxShadow="0 8px 32px rgba(229, 62, 62, 0.4)"
        mx={4}
      >
        <ModalHeader 
          color="white" 
          borderBottom="1px solid" 
          borderColor="whiteAlpha.200"
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Icon as={FaExclamationTriangle} color="red.400" />
          Delete Feedback
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text color="white">
              Are you sure you want to delete this feedback? This action cannot be undone.
            </Text>
            <Box
              bg="whiteAlpha.100"
              p={4}
              borderRadius="md"
              borderWidth={1}
              borderColor="whiteAlpha.200"
            >
              <VStack align="start" spacing={2}>
                <HStack>
                  <Badge colorScheme={
                    feedback.status === 'completed' ? 'green' :
                    feedback.status === 'in-progress' ? 'yellow' : 'red'
                  }>
                    {feedback.status}
                  </Badge>
                  <Text color="white">Rating: {feedback.rating} ⭐</Text>
                </HStack>
                <Text color="gray.200">{feedback.message}</Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.200">
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="white"
            _hover={{
              bg: "whiteAlpha.200"
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 

export default DeleteConfirmationModal 