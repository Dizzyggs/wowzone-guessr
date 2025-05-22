import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Skeleton,
  Button,
  useDisclosure,
  Icon,
  Flex,
  HStack,
  VStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaComments, FaStar } from 'react-icons/fa'
import { getLatestFeedback } from '../firebaseFunctions'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDetailModal from '../components/FeedbackDetailModal'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

interface Feedback {
  message: string
  rating: number
  timestamp: Date
  status: 'new' | 'in-progress' | 'completed'
  response?: string
}

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const { isOpen: isSubmitOpen, onOpen: onSubmitOpen, onClose: onSubmitClose } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  const loadFeedback = async () => {
    setIsLoading(true)
    const data = await getLatestFeedback()
    setFeedback(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadFeedback()
  }, [isSubmitOpen])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue'
      case 'in-progress': return 'yellow'
      case 'completed': return 'green'
      default: return 'gray'
    }
  }

  const handleFeedbackClick = (item: Feedback) => {
    setSelectedFeedback(item)
    onDetailOpen()
  }

  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" display="flex" alignItems="center" gap={3}>
            <Icon as={FaComments} color="blue.400" />
            Community Feedback
          </Heading>
          <Button
            onClick={onSubmitOpen}
            colorScheme="blue"
            size="lg"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(66, 153, 225, 0.4)'
            }}
            transition="all 0.2s"
          >
            Submit Feedback
          </Button>
        </Flex>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : feedback.length === 0 ? (
          <Card bg="whiteAlpha.100" borderRadius="lg">
            <CardBody textAlign="center">
              <Text>No feedback submitted yet. Be the first one!</Text>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {feedback.map((item, index) => (
              <MotionCard
                key={index}
                bg="whiteAlpha.100"
                borderRadius="lg"
                cursor="pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleFeedbackClick(item)}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Badge
                        colorScheme={getStatusColor(item.status)}
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {item.status}
                      </Badge>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        {item.timestamp.toLocaleDateString()}
                      </Text>
                    </Flex>
                    <HStack spacing={1}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          as={FaStar}
                          w={4}
                          h={4}
                          color={i < item.rating ? "yellow.400" : "gray.500"}
                        />
                      ))}
                    </HStack>
                    <Text
                      noOfLines={3}
                      fontSize="md"
                      color="white"
                    >
                      {item.message}
                    </Text>
                    {item.response && (
                      <Badge colorScheme="blue" alignSelf="flex-start">
                        Has Response
                      </Badge>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        )}
      </MotionBox>

      <FeedbackModal isOpen={isSubmitOpen} onClose={onSubmitClose} />
      {selectedFeedback && (
        <FeedbackDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          feedback={selectedFeedback}
        />
      )}
    </Container>
  )
}

export default FeedbackPage 