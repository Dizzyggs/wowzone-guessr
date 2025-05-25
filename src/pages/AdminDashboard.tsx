import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Badge,
  useDisclosure,
  Flex,
  IconButton,
  Spinner,
  Center
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { getAdminStats, getPaginatedFeedback, submitChangelog, respondToFeedback } from '../firebaseFunctions'
import { FaChevronLeft, FaChevronRight, FaReply } from 'react-icons/fa'
import Layout from '../components/Layout'

interface AdminStats {
  totalPlayers: number
  feedbackCount: number
  averageRating: string
}

interface Feedback {
  id?: string
  message: string
  rating: number
  timestamp: Date
  status: 'new' | 'in-progress' | 'completed'
  response?: string
  responseDate?: Date | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [totalFeedback, setTotalFeedback] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  
  // Modal states for changelog
  const { isOpen: isChangelogOpen, onOpen: onChangelogOpen, onClose: onChangelogClose } = useDisclosure()
  const [changelogData, setChangelogData] = useState({ title: '', description: '', type: 'feature' })
  
  // Modal states for feedback response
  const { isOpen: isResponseOpen, onOpen: onResponseOpen, onClose: onResponseClose } = useDisclosure()
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<'new' | 'in-progress' | 'completed'>('in-progress')

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated')
      if (!isAuthenticated) {
        navigate('/admin')
        return false
      }
      return true
    }

    const loadData = async () => {
      if (!checkAuth()) return
      
      try {
        setIsLoading(true)
        const statsData = await getAdminStats()
        setStats(statsData)
        
        const { feedback: feedbackData, total } = await getPaginatedFeedback(currentPage)
        setFeedback(feedbackData)
        setTotalFeedback(total)
      } catch (error) {
        console.error('Error loading admin data:', error)
        toast({
          title: 'Error loading data',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [navigate, currentPage])

  const handleSubmitChangelog = async () => {
    if (!changelogData.title || !changelogData.description) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    const result = await submitChangelog(
      changelogData.title,
      changelogData.description,
      changelogData.type as 'feature' | 'bugfix' | 'improvement'
    )

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
    })

    if (result.success) {
      setChangelogData({ title: '', description: '', type: 'feature' })
      onChangelogClose()
    }
    setIsSubmitting(false)
  }

  const handleOpenResponse = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setResponse(feedback.response || '')
    setStatus(feedback.status)
    onResponseOpen()
  }

  const handleSubmitResponse = async () => {
    if (!selectedFeedback?.id || !response) {
      toast({
        title: 'Missing response',
        description: 'Please enter a response',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    const result = await respondToFeedback(selectedFeedback.id, response, status)

    if (result.success) {
      // Refresh feedback data
      const { feedback: feedbackData } = await getPaginatedFeedback(currentPage)
      setFeedback(feedbackData)
      onResponseClose()
    }

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
    })
    setIsSubmitting(false)
  }

  const totalPages = Math.ceil(totalFeedback / 5)

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading size="lg">Admin Dashboard</Heading>
          <HStack>
            <Button colorScheme="blue" onClick={onChangelogOpen}>
              New Changelog
            </Button>
            <Button onClick={() => {
              sessionStorage.removeItem('isAdminAuthenticated')
              navigate('/admin')
            }}>
              Logout
            </Button>
          </HStack>
        </Flex>

        {isLoading ? (
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text>Loading dashboard data...</Text>
            </VStack>
          </Center>
        ) : (
          <>
            {/* Stats Grid */}
            <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
              <Box p={6} bg="rgba(10, 15, 28, 0.95)" shadow="md" borderRadius="lg" border="2px solid" borderColor="purple.400">
                <Heading size="sm" mb={2} color="white">Total Players</Heading>
                <Text fontSize="2xl" color="white">{stats?.totalPlayers || 0}</Text>
              </Box>
              <Box p={6} bg="rgba(10, 15, 28, 0.95)" shadow="md" borderRadius="lg" border="2px solid" borderColor="blue.400">
                <Heading size="sm" mb={2} color="white">Feedback Count</Heading>
                <Text fontSize="2xl" color="white">{stats?.feedbackCount || 0}</Text>
              </Box>
              <Box p={6} bg="rgba(10, 15, 28, 0.95)" shadow="md" borderRadius="lg" border="2px solid" borderColor="yellow.400">
                <Heading size="sm" mb={2} color="white">Average Rating</Heading>
                <Text fontSize="2xl" color="white">{stats?.averageRating || '0.0'} ⭐</Text>
              </Box>
            </Grid>

            {/* Recent Feedback */}
            <Box bg="rgba(10, 15, 28, 0.95)" shadow="md" borderRadius="lg" p={6} border="2px solid" borderColor="blue.400">
              <Heading size="md" mb={4} color="white">Recent Feedback</Heading>
              <VStack spacing={4} align="stretch">
                {feedback.length === 0 ? (
                  <Center py={8}>
                    <Text color="gray.400">No feedback entries yet.</Text>
                  </Center>
                ) : (
                  feedback.map((item) => (
                    <Box key={item.id} p={4} bg="whiteAlpha.100" borderRadius="md" borderWidth={1} borderColor="whiteAlpha.200">
                      <Flex justifyContent="space-between" alignItems="flex-start">
                        <VStack align="start" spacing={2} flex={1}>
                          <HStack>
                            <Badge colorScheme={
                              item.status === 'completed' ? 'green' :
                              item.status === 'in-progress' ? 'yellow' : 'red'
                            }>
                              {item.status}
                            </Badge>
                            <Text color="white">Rating: {item.rating} ⭐</Text>
                          </HStack>
                          <Text color="white">{item.message}</Text>
                          {item.response && (
                            <Box mt={2} pl={4} borderLeftWidth={2} borderColor="blue.200">
                              <Text fontSize="sm" color="gray.400">Response ({new Date(item.responseDate!).toLocaleDateString()}):</Text>
                              <Text color="gray.200">{item.response}</Text>
                            </Box>
                          )}
                        </VStack>
                        <IconButton
                          aria-label="Reply to feedback"
                          icon={<FaReply />}
                          onClick={() => handleOpenResponse(item)}
                          ml={4}
                          colorScheme="blue"
                          variant="outline"
                        />
                      </Flex>
                    </Box>
                  ))
                )}
              </VStack>

              {feedback.length > 0 && (
                <Flex justifyContent="center" mt={4}>
                  <HStack>
                    <IconButton
                      aria-label="Previous page"
                      icon={<FaChevronLeft />}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      isDisabled={currentPage === 1}
                      colorScheme="blue"
                      variant="outline"
                    />
                    <Text color="white">
                      Page {currentPage} of {totalPages}
                    </Text>
                    <IconButton
                      aria-label="Next page"
                      icon={<FaChevronRight />}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      isDisabled={currentPage === totalPages}
                      colorScheme="blue"
                      variant="outline"
                    />
                  </HStack>
                </Flex>
              )}
            </Box>
          </>
        )}

        {/* Changelog Modal */}
        <Modal isOpen={isChangelogOpen} onClose={onChangelogClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Changelog</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Title"
                  value={changelogData.title}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Select
                  value={changelogData.type}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="feature">Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="improvement">Improvement</option>
                </Select>
                <Textarea
                  placeholder="Description"
                  value={changelogData.description}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, description: e.target.value }))}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onChangelogClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmitChangelog}
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Response Modal */}
        <Modal isOpen={isResponseOpen} onClose={onResponseClose} isCentered>
          <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
          <ModalContent
            bg="rgba(10, 15, 28, 0.95)"
            border="2px solid"
            borderColor="blue.400"
            boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
            mx={4}
          >
            <ModalHeader color="white" borderBottom="1px solid" borderColor="whiteAlpha.200">
              Respond to Feedback
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Box
                  bg="whiteAlpha.100"
                  p={4}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor="whiteAlpha.200"
                >
                  <Text color="gray.400" fontSize="sm" mb={1}>Original Feedback:</Text>
                  <Text color="white">{selectedFeedback?.message}</Text>
                  <HStack mt={2} spacing={2}>
                    <Badge colorScheme={
                      selectedFeedback?.status === 'completed' ? 'green' :
                      selectedFeedback?.status === 'in-progress' ? 'yellow' : 'red'
                    }>
                      {selectedFeedback?.status}
                    </Badge>
                    <Text color="gray.400" fontSize="sm">
                      Rating: {selectedFeedback?.rating} ⭐
                    </Text>
                  </HStack>
                </Box>

                <Box>
                  <Text color="gray.400" fontSize="sm" mb={2}>Update Status:</Text>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'new' | 'in-progress' | 'completed')}
                    bg="whiteAlpha.100"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    color="white"
                    _hover={{
                      borderColor: "blue.400"
                    }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                    }}
                  >
                    <option style={{ backgroundColor: "rgb(10, 15, 28)" }} value="new">New</option>
                    <option style={{ backgroundColor: "rgb(10, 15, 28)" }} value="in-progress">In Progress</option>
                    <option style={{ backgroundColor: "rgb(10, 15, 28)" }} value="completed">Completed</option>
                  </Select>
                </Box>

                <Box>
                  <Text color="gray.400" fontSize="sm" mb={2}>Your Response:</Text>
                  <Textarea
                    placeholder="Type your response here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    minH="120px"
                    bg="whiteAlpha.100"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    color="white"
                    _hover={{
                      borderColor: "blue.400"
                    }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                    }}
                    _placeholder={{
                      color: "whiteAlpha.400"
                    }}
                  />
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.200">
              <Button
                variant="ghost"
                mr={3}
                onClick={onResponseClose}
                color="white"
                _hover={{
                  bg: "whiteAlpha.200"
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmitResponse}
                isLoading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit Response
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  )
} 