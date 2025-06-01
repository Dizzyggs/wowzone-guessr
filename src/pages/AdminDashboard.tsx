import { useEffect, useState } from 'react'
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
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  FormControl,
  FormLabel
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { 
  getAdminStats, 
  getPaginatedFeedback, 
  submitChangelog, 
  submitChangelogDraft,
  getDraftChangelogs,
  publishChangelog,
  respondToFeedback,
  updateDraftChangelog,
  deleteFeedback
} from '../firebaseFunctions'
import { FaChevronLeft, FaChevronRight, FaReply, FaEdit, FaTrash } from 'react-icons/fa'
import Layout from '../components/Layout'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

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

interface Changelog {
  id?: string
  title: string
  type: 'feature' | 'bugfix' | 'improvement'
  added?: string
  changed?: string
  removed?: string
  date: Date
  likes?: number
  isDraft?: boolean
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
  const [changelogData, setChangelogData] = useState<{
    title: string;
    type: 'feature' | 'bugfix' | 'improvement';
    added: string;
    changed: string;
    removed: string;
  }>({
    title: '',
    type: 'feature',
    added: '',
    changed: '',
    removed: ''
  })
  
  // Modal states for feedback response
  const { isOpen: isResponseOpen, onOpen: onResponseOpen, onClose: onResponseClose } = useDisclosure()
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<'new' | 'in-progress' | 'completed'>('in-progress')

  const [draftChangelogs, setDraftChangelogs] = useState<Changelog[]>([])
  const [isDraft, setIsDraft] = useState(false)
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false)

  // Add state for editing drafts
  const [editingDraft, setEditingDraft] = useState<Changelog | null>(null)

  // Add state for delete confirmation modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null)

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

  useEffect(() => {
    if (sessionStorage.getItem('isAdminAuthenticated')) {
      loadDrafts()
    }
  }, [])

  const loadDrafts = async () => {
    setIsLoadingDrafts(true)
    try {
      const drafts = await getDraftChangelogs()
      setDraftChangelogs(drafts)
    } catch (error) {
      console.error('Error loading drafts:', error)
      toast({
        title: 'Error loading drafts',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoadingDrafts(false)
    }
  }

  const handleEditDraft = (draft: Changelog) => {
    setEditingDraft(draft)
    setChangelogData({
      title: draft.title,
      type: draft.type,
      added: draft.added || '',
      changed: draft.changed || '',
      removed: draft.removed || ''
    })
    setIsDraft(true)
    onChangelogOpen()
  }

  const handleSubmitChangelog = async () => {
    if (!changelogData.title || (!changelogData.added && !changelogData.changed && !changelogData.removed)) {
      toast({
        title: 'Missing required fields',
        description: 'Please provide a title and at least one section (Added, Changed/Fixed, or Removed)',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    let result

    if (editingDraft) {
      // Update existing draft
      result = await updateDraftChangelog(
        editingDraft.id!,
        {
          title: changelogData.title,
          type: changelogData.type,
          added: changelogData.added || undefined,
          changed: changelogData.changed || undefined,
          removed: changelogData.removed || undefined
        }
      )
    } else {
      // Create new changelog/draft
      const submitFunction = isDraft ? submitChangelogDraft : submitChangelog
      result = await submitFunction(
        changelogData.title,
        changelogData.type,
        {
          added: changelogData.added || undefined,
          changed: changelogData.changed || undefined,
          removed: changelogData.removed || undefined
        }
      )
    }

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
    })

    if (result.success) {
      setChangelogData({ title: '', type: 'feature', added: '', changed: '', removed: '' })
      setEditingDraft(null)
      onChangelogClose()
      
      // Refresh drafts list
      if (isDraft || editingDraft) {
        await loadDrafts()
      }
    }
    setIsSubmitting(false)
  }

  const handlePublishDraft = async (changelogId: string) => {
    setIsSubmitting(true)
    const result = await publishChangelog(changelogId)

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
    })

    if (result.success) {
      await loadDrafts()
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

  const handleDeleteClick = (feedback: Feedback) => {
    setFeedbackToDelete(feedback)
    onDeleteOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!feedbackToDelete?.id) return;

    const result = await deleteFeedback(feedbackToDelete.id);

    if (result.success) {
      // Refresh feedback data
      const { feedback: feedbackData, total } = await getPaginatedFeedback(currentPage);
      setFeedback(feedbackData);
      setTotalFeedback(total);
      onDeleteClose();
    }

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
    });
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

            <Tabs variant="enclosed" colorScheme="blue" mb={8}>
              <TabList>
                <Tab>Feedback</Tab>
                <Tab>Draft Changelogs</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0} pt={4}>
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
                              <HStack spacing={2}>
                                <IconButton
                                  aria-label="Delete feedback"
                                  icon={<FaTrash />}
                                  onClick={() => handleDeleteClick(item)}
                                  colorScheme="red"
                                  variant="ghost"
                                />
                                <IconButton
                                  aria-label="Reply to feedback"
                                  icon={<FaReply />}
                                  onClick={() => handleOpenResponse(item)}
                                  colorScheme="blue"
                                  variant="outline"
                                />
                              </HStack>
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
                </TabPanel>

                <TabPanel p={0} pt={4}>
                  {/* Draft Changelogs Section */}
                  <Box bg="rgba(10, 15, 28, 0.95)" shadow="md" borderRadius="lg" p={6} border="2px solid" borderColor="purple.400">
                    <Heading size="md" mb={4} color="white">Draft Changelogs</Heading>
                    <VStack spacing={4} align="stretch">
                      {isLoadingDrafts ? (
                        <Center py={8}>
                          <Spinner />
                        </Center>
                      ) : draftChangelogs.length === 0 ? (
                        <Center py={8}>
                          <Text color="gray.400">No draft changelogs.</Text>
                        </Center>
                      ) : (
                        draftChangelogs.map((draft) => (
                          <Box key={draft.id} p={4} bg="whiteAlpha.100" borderRadius="md" borderWidth={1} borderColor="whiteAlpha.200">
                            <VStack align="stretch" spacing={3}>
                              <Flex justify="space-between" align="center">
                                <Heading size="sm" color="white">{draft.title}</Heading>
                                <HStack>
                                  <Badge colorScheme={draft.type === 'feature' ? 'green' : draft.type === 'bugfix' ? 'red' : 'blue'}>
                                    {draft.type}
                                  </Badge>
                                  <IconButton
                                    aria-label="Edit draft"
                                    icon={<FaEdit />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleEditDraft(draft)}
                                  />
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    onClick={() => handlePublishDraft(draft.id!)}
                                    isLoading={isSubmitting}
                                  >
                                    Publish
                                  </Button>
                                </HStack>
                              </Flex>
                              {draft.added && (
                                <Text color="green.200">Added: {draft.added}</Text>
                              )}
                              {draft.changed && (
                                <Text color="blue.200">Changed: {draft.changed}</Text>
                              )}
                              {draft.removed && (
                                <Text color="red.200">Removed: {draft.removed}</Text>
                              )}
                              <Text color="gray.400" fontSize="sm">
                                Created: {draft.date.toLocaleDateString()}
                              </Text>
                            </VStack>
                          </Box>
                        ))
                      )}
                    </VStack>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}

        {/* Changelog Modal */}
        <Modal isOpen={isChangelogOpen} onClose={() => {
          onChangelogClose()
          setEditingDraft(null)
          setChangelogData({ title: '', type: 'feature', added: '', changed: '', removed: '' })
        }} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.900" color="white">
            <ModalHeader>{editingDraft ? 'Edit Draft Changelog' : 'New Changelog'}</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                {!editingDraft && (
                  <FormControl display="flex" alignItems="center" mb={4}>
                    <FormLabel mb={0}>Save as draft</FormLabel>
                    <Switch
                      isChecked={isDraft}
                      onChange={(e) => setIsDraft(e.target.checked)}
                      colorScheme="blue"
                    />
                  </FormControl>
                )}
                <Input
                  placeholder="Title"
                  value={changelogData.title}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Select
                  value={changelogData.type}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, type: e.target.value as 'feature' | 'bugfix' | 'improvement' }))}
                >
                  <option value="feature">Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="improvement">Improvement</option>
                </Select>
                <Textarea
                  placeholder="Added (optional)"
                  value={changelogData.added}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, added: e.target.value }))}
                />
                <Textarea
                  placeholder="Changed/Fixed (optional)"
                  value={changelogData.changed}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, changed: e.target.value }))}
                />
                <Textarea
                  placeholder="Removed (optional)"
                  value={changelogData.removed}
                  onChange={(e) => setChangelogData(prev => ({ ...prev, removed: e.target.value }))}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => {
                onChangelogClose()
                setEditingDraft(null)
                setChangelogData({ title: '', type: 'feature', added: '', changed: '', removed: '' })
              }}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmitChangelog}
                isLoading={isSubmitting}
              >
                {editingDraft ? 'Update Draft' : isDraft ? 'Save Draft' : 'Publish'}
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

        {/* Add DeleteConfirmationModal */}
        {feedbackToDelete && (
          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            onConfirm={handleDeleteConfirm}
            isLoading={isSubmitting}
            feedback={feedbackToDelete}
          />
        )}
      </Container>
    </Layout>
  )
} 