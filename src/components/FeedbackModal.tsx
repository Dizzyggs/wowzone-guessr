import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
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
  Flex,
  IconButton,
  Heading
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaSmile, FaExclamationCircle, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { submitFeedback } from '../firebaseFunctions'
import { containsProfanity } from '../utils/profanityFilter'

const MotionModalContent = motion(ModalContent)
const MotionBox = motion(Box)
const MotionIcon = motion(Icon)

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

  // Add debounced hover state to prevent glitching
  const [debouncedHoveredRating, setDebouncedHoveredRating] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setMessage('')
      setRating(0)
      setHoveredRating(0)
      setDebouncedHoveredRating(0)
      setShowProfanityError(false)
    }
  }, [isOpen])

  // Debounce hover state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHoveredRating(hoveredRating)
    }, 50)
    return () => clearTimeout(timer)
  }, [hoveredRating])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    if (showProfanityError) {
      const profanityCheck = containsProfanity(newMessage)
      setShowProfanityError(profanityCheck.hasProfanity)
    }
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please enter your feedback message',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (!rating) {
      toast({
        title: 'Rating required',
        description: 'Please rate your experience',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const profanityCheck = containsProfanity(message)
    if (profanityCheck.hasProfanity) {
      setShowProfanityError(true)
      return
    }

    setIsSubmitting(true)
    try {
      await submitFeedback(message, rating)
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        status: 'error',
        duration: 3000,
      })
    }
    setIsSubmitting(false)
  }

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Great'
      case 4: return 'Excellent'
      case 5: return 'Outstanding'
      default: return 'Select your rating'
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'red.400'
      case 2: return 'orange.400'
      case 3: return 'yellow.400'
      case 4: return 'green.400'
      case 5: return 'blue.400'
      default: return 'whiteAlpha.400'
    }
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
        {/* Header */}
        <Flex 
          justify="space-between" 
          align="center" 
          p={6} 
          pb={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Box>
            <Heading 
              fontSize="2xl"
              display="flex"
              alignItems="center"
              gap={3}
            >
              <Icon as={FaSmile} color="blue.400" />
              Share Your Feedback
            </Heading>
            <Text color="whiteAlpha.600" mt={1}>
              Help us improve WoW ZoneGuessr
            </Text>
          </Box>
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
          <VStack spacing={8} align="stretch">
            {/* Rating Section */}
            <Box>
              <Text mb={4} color="whiteAlpha.700">
                How would you rate your experience?
              </Text>
              <Box 
                position="relative" 
                bg="whiteAlpha.50"
                p={6}
                borderRadius="xl"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  width="200%"
                  height="200%"
                  background={`radial-gradient(circle, ${getRatingColor(debouncedHoveredRating || rating)}20 0%, transparent 70%)`}
                  transition="background 0.3s ease-out"
                  pointerEvents="none"
                />
                <VStack spacing={4}>
                  <HStack spacing={4} justify="center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MotionBox
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        cursor="pointer"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        position="relative"
                        zIndex={1}
                      >
                        <MotionIcon
                          as={FaStar}
                          w={8}
                          h={8}
                          color={(debouncedHoveredRating || rating) >= star ? getRatingColor(debouncedHoveredRating || rating) : "whiteAlpha.200"}
                          transition={{ duration: 0.2 }}
                        />
                      </MotionBox>
                    ))}
                  </HStack>
                  <AnimatePresence mode="wait">
                    <MotionBox
                      key={debouncedHoveredRating || rating}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      textAlign="center"
                    >
                      <Text 
                        fontSize="lg" 
                        fontWeight="bold"
                        color={getRatingColor(debouncedHoveredRating || rating)}
                      >
                        {getRatingLabel(debouncedHoveredRating || rating)}
                      </Text>
                    </MotionBox>
                  </AnimatePresence>
                </VStack>
              </Box>
            </Box>

            {/* Message Section */}
            <Box>
              <Text mb={4} color="whiteAlpha.700">
                Share your thoughts with us
              </Text>
              <Textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="What's on your mind? We'd love to hear your feedback..."
                minH="150px"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor={showProfanityError ? "red.400" : "whiteAlpha.200"}
                _hover={{
                  borderColor: showProfanityError ? "red.400" : "whiteAlpha.300"
                }}
                _focus={{
                  borderColor: showProfanityError ? "red.400" : "blue.400",
                  boxShadow: showProfanityError 
                    ? "0 0 0 1px var(--chakra-colors-red-400)"
                    : "0 0 0 1px var(--chakra-colors-blue-400)"
                }}
                resize="vertical"
              />
              <AnimatePresence>
                {showProfanityError && (
                  <MotionBox
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    mt={2}
                    color="red.400"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FaExclamationCircle} />
                    <Text fontSize="sm">
                      Please keep your feedback family-friendly
                    </Text>
                  </MotionBox>
                )}
              </AnimatePresence>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter 
          p={6} 
          pt={4}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          gap={3}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            _hover={{ bg: "whiteAlpha.100" }}
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
            px={8}
          >
            Submit Feedback
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  )
}

export default FeedbackModal 