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
  Button,
  useDisclosure,
  Icon,
  Flex,
  HStack,
  VStack,
  Select,
  Center,
  Spinner
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaComments, FaStar, FaSort } from 'react-icons/fa'
import { getLatestFeedback } from '../firebaseFunctions'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDetailModal from '../components/FeedbackDetailModal'

const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionSelect = motion(Select)

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
  const [sortFilter, setSortFilter] = useState('newest')

  const loadFeedback = async () => {
    setIsLoading(true)
    try {
      const feedbackData = await getLatestFeedback()
      let sortedFeedback = [...feedbackData]
      
      switch (sortFilter) {
        case 'newest':
          sortedFeedback.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          break
        case 'oldest':
          sortedFeedback.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          break
        case 'completed':
          sortedFeedback = sortedFeedback.filter(f => f.status === 'completed')
          break
        case 'in-progress':
          sortedFeedback = sortedFeedback.filter(f => f.status === 'in-progress')
          break
        case 'pending':
          sortedFeedback = sortedFeedback.filter(f => f.status === 'new')
          break
        case 'answered':
          sortedFeedback = sortedFeedback.filter(f => f.response)
          break
        case 'unanswered':
          sortedFeedback = sortedFeedback.filter(f => !f.response)
          break
      }
      
      setFeedback(sortedFeedback)
    } catch (error) {
      console.error('Error loading feedback:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadFeedback()
  }, [sortFilter])

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
        <Flex 
          justify="space-between" 
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          mb={8}
        >
          <Heading 
            size={{ base: "lg", md: "xl" }} 
            display="flex" 
            alignItems="center" 
            gap={3}
          >
            <Icon as={FaComments} color="blue.400" />
            Community Feedback
          </Heading>
          <Button
            onClick={onSubmitOpen}
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
            width={{ base: "100%", md: "auto" }}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(66, 153, 225, 0.4)'
            }}
            transition="all 0.2s"
          >
            Submit Feedback
          </Button>
        </Flex>

        <Box maxW={{ base: "100%", md: "300px" }} mb={6}>
          <MotionSelect
            icon={<Icon as={FaSort} />}
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            bg="gray.900"
            size={{ base: "md", md: "lg" }}
            borderColor="whiteAlpha.300"
            _hover={{
              borderColor: "blue.400",
              transform: "translateY(-1px)"
            }}
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px #4299E1"
            }}
            transition="all 0.2s"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <option style={{ backgroundColor: "#1A202C" }} value="newest">Newest First</option>
            <option style={{ backgroundColor: "#1A202C" }} value="oldest">Oldest First</option>
            <option style={{ backgroundColor: "#1A202C" }} value="completed">Completed</option>
            <option style={{ backgroundColor: "#1A202C" }} value="in-progress">In Progress</option>
            <option style={{ backgroundColor: "#1A202C" }} value="pending">Pending</option>
            <option style={{ backgroundColor: "#1A202C" }} value="answered">Answered</option>
            <option style={{ backgroundColor: "#1A202C" }} value="unanswered">Unanswered</option>
          </MotionSelect>
        </Box>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <Center py={8} as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Spinner size="xl" color="blue.400" thickness="4px" speed="0.8s" />
            </Center>
          ) : feedback.length === 0 ? (
            <Center py={8} as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Text color="whiteAlpha.700">No feedback found matching the selected filter.</Text>
            </Center>
          ) : (
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={{ base: 3, md: 4 }}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {feedback.map((item, index) => (
                <MotionCard
                  key={index}
                  bg="gray.900"
                  borderColor="whiteAlpha.100"
                  borderWidth="1px"
                  borderRadius="lg"
                  cursor="pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleFeedbackClick(item)}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    borderColor: "blue.400"
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Flex 
                        justify="space-between" 
                        align={{ base: "start", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                        gap={{ base: 2, md: 0 }}
                      >
                        <Badge
                          colorScheme={getStatusColor(item.status)}
                          px={2}
                          py={1}
                          borderRadius="full"
                          alignSelf={{ base: "flex-start", md: "center" }}
                        >
                          {item.status}
                        </Badge>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color="whiteAlpha.700"
                        >
                          {item.timestamp.toLocaleDateString()}
                        </Text>
                      </Flex>
                      <HStack spacing={1}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            as={FaStar}
                            w={{ base: 3, md: 4 }}
                            h={{ base: 3, md: 4 }}
                            color={i < item.rating ? "yellow.400" : "gray.500"}
                          />
                        ))}
                      </HStack>
                      <Text
                        noOfLines={3}
                        fontSize={{ base: "sm", md: "md" }}
                        color="white"
                      >
                        {item.message}
                      </Text>
                      {item.response && (
                        <Badge 
                          colorScheme="blue" 
                          alignSelf="flex-start"
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Has Response
                        </Badge>
                      )}
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          )}
        </AnimatePresence>
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