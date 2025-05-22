import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  VStack,
  useToast,
  HStack,
  Icon,
  Text,
  Box,
  Flex
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaSmile, FaExclamationCircle, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { submitFeedback } from '../firebaseFunctions'
import { containsProfanity } from '../utils/profanityFilter'

const MotionModalContent = motion(ModalContent)
const MotionBox = motion(Box)

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProfanityError, setShowProfanityError] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!isOpen) {
      setMessage('')
      setRating(0)
      setHoveredRating(0)
      setShowProfanityError(false)
    }
  }, [isOpen])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    if (showProfanityError) {
      // Only check while error is shown to avoid premature warnings
      const profanityCheck = containsProfanity(newMessage)
      setShowProfanityError(profanityCheck.hasProfanity)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!message.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter your feedback',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      if (rating === 0) {
        toast({
          title: 'Error',
          description: 'Please select a rating',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      const profanityCheck = containsProfanity(message)
      if (profanityCheck.hasProfanity) {
        setShowProfanityError(true)
        return
      }

      setIsSubmitting(true)
      const result = await submitFeedback(message.trim(), rating)
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setMessage('')
        setRating(0)
        onClose()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
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
        <ModalHeader fontSize="2xl" textAlign="center" display="flex" alignItems="center" gap={3}>
          <Icon as={FaSmile} color="blue.400" />
          Submit Feedback
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <VStack spacing={2} align="center" w="full">
              <Text mb={2}>Rate your experience</Text>
              <HStack spacing={2}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MotionBox
                    key={star}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Icon
                      as={FaStar}
                      w={8}
                      h={8}
                      color={(hoveredRating || rating) >= star ? "yellow.400" : "gray.500"}
                    />
                  </MotionBox>
                ))}
              </HStack>
            </VStack>
            
            <Box position="relative" w="full">
              <Textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Share your thoughts, suggestions, or report issues... (Please keep it family-friendly)"
                minH="150px"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor={showProfanityError ? "red.400" : "whiteAlpha.300"}
                _hover={{
                  borderColor: showProfanityError ? "red.400" : "blue.400"
                }}
                _focus={{
                  borderColor: showProfanityError ? "red.400" : "blue.400",
                  boxShadow: showProfanityError ? "0 0 0 1px #F56565" : "0 0 0 1px #4299E1"
                }}
              />
              <AnimatePresence>
                {showProfanityError && (
                  <MotionBox
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    mt={3}
                  >
                    <Box
                      bg="red.500"
                      color="white"
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="red.600"
                      boxShadow="0 4px 12px rgba(229, 62, 62, 0.3)"
                    >
                      <Flex align="center" gap={3}>
                        <Icon as={FaExclamationCircle} w={5} h={5} />
                        <Text fontWeight="medium">
                          Please remove inappropriate language before submitting.
                        </Text>
                      </Flex>
                    </Box>
                  </MotionBox>
                )}
              </AnimatePresence>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            onClick={onClose}
            leftIcon={<Icon as={FaTimes} />}
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme={showProfanityError ? "red" : "blue"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            leftIcon={<Icon as={FaPaperPlane} />}
            isDisabled={showProfanityError}
          >
            Submit Feedback
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  )
}

export default FeedbackModal 