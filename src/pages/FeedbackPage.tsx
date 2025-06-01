import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useDisclosure,
  Icon,
  Flex,
  HStack,
  VStack,
  Center,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  // useBreakpointValue,
  Portal,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import { 
  FaComments, 
  FaStar, 
  FaSort, 
  FaFilter, 
  FaClock, 
  FaCheck, 
  FaChevronDown,
  FaLightbulb,
  FaRegClock,
} from 'react-icons/fa'
import { getLatestFeedback } from '../firebaseFunctions'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDetailModal from '../components/FeedbackDetailModal'

const MotionBox = motion(React.forwardRef<HTMLDivElement, any>((props, ref) => <Box ref={ref} {...props} />))
// const MotionFlex = motion(React.forwardRef<HTMLDivElement, any>((props, ref) => <Flex ref={ref} {...props} />))

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
  // const isMobile = useBreakpointValue({ base: true, md: false })

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

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const filterOptions = [
    { value: 'newest', label: 'Newest First', icon: FaSort },
    { value: 'oldest', label: 'Oldest First', icon: FaSort },
    { value: 'completed', label: 'Completed', icon: FaCheck },
    { value: 'in-progress', label: 'In Progress', icon: FaRegClock },
    { value: 'pending', label: 'Pending', icon: FaClock },
    { value: 'answered', label: 'Answered', icon: FaComments },
    { value: 'unanswered', label: 'Unanswered', icon: FaLightbulb },
  ]

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }}>
      {/* Background Gradient */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial-gradient(circle at top right, rgba(66, 153, 225, 0.1), transparent 60%), radial-gradient(circle at bottom left, rgba(159, 122, 234, 0.1), transparent 60%)"
        zIndex={-1}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 8, md: 12 }} align="stretch">
        {/* Header Section */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          position="relative"
        >
          <Box
            position="absolute"
            top="-100px"
            right="-100px"
            width="300px"
            height="300px"
            background="radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, transparent 70%)"
            filter="blur(40px)"
            pointerEvents="none"
          />
          
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align={{ base: "stretch", md: "center" }}
            gap={{ base: 6, md: 0 }}
            position="relative"
          >
            <Box>
              <Heading 
                fontSize={{ base: "4xl", md: "6xl" }}
                bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
                display="flex"
                alignItems="center"
                gap={4}
              >
                <Icon as={FaComments} />
                Feedback
              </Heading>
              <Text 
                mt={3} 
                color="whiteAlpha.800" 
                fontSize={{ base: "lg", md: "xl" }}
                maxW="600px"
                lineHeight="tall"
              >
                Share your thoughts and help shape the future of WoW ZoneGuessr
              </Text>
            </Box>

            <HStack spacing={4} position="relative">
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FaChevronDown />}
                  leftIcon={<FaFilter />}
                  bg="whiteAlpha.50"
                  backdropFilter="blur(10px)"
                  _hover={{ bg: "whiteAlpha.100" }}
                  _active={{ bg: "whiteAlpha.200" }}
                  borderWidth={1}
                  borderColor="whiteAlpha.200"
                  fontSize="sm"
                  px={6}
                  h={12}
                  color={"white"}
                >
                  Filter
                </MenuButton>
                <Portal>
                  <MenuList
                    bg="rgba(13, 16, 33, 0.95)"
                    borderColor="whiteAlpha.200"
                    boxShadow="dark-lg"
                    backdropFilter="blur(10px)"
                    py={2}
                    overflow="hidden"
                  >
                    {filterOptions.map(option => (
                      <MenuItem
                        key={option.value}
                        onClick={() => setSortFilter(option.value)}
                        bg="transparent"
                        _hover={{ bg: "whiteAlpha.200" }}
                        icon={<Icon as={option.icon} />}
                        isDisabled={sortFilter === option.value}
                        h={12}
                        px={4}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Portal>
              </Menu>

              <Button
                onClick={onSubmitOpen}
                colorScheme="blue"
                size="lg"
                px={8}
                h={12}
                fontWeight="bold"
                bgGradient="linear(to-r, blue.500, purple.500)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px -8px rgba(66, 153, 225, 0.5)',
                  bgGradient: "linear(to-r, blue.600, purple.600)"
                }}
                _active={{
                  transform: 'translateY(0)',
                  bgGradient: "linear(to-r, blue.700, purple.700)"
                }}
                transition="all 0.2s"
              >
                Share Feedback
              </Button>
            </HStack>
          </Flex>
        </MotionBox>

        {/* Active Filter Tag */}
        {sortFilter !== 'newest' && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Tag
              size="lg"
              variant="subtle"
              colorScheme="blue"
              borderRadius="full"
              px={6}
              py={3}
              bg="whiteAlpha.100"
              backdropFilter="blur(8px)"
            >
              <TagLeftIcon boxSize={5} as={filterOptions.find(o => o.value === sortFilter)?.icon} />
              <TagLabel fontSize="md" fontWeight="medium">{filterOptions.find(o => o.value === sortFilter)?.label}</TagLabel>
            </Tag>
          </MotionBox>
        )}

        {/* Feedback Grid */}
        <Box position="relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Center py={20}>
                <Spinner 
                  size="xl" 
                  color="blue.400" 
                  thickness="4px"
                  speed="0.8s"
                  emptyColor="whiteAlpha.100"
                />
              </Center>
            ) : feedback.length === 0 ? (
              <Center py={20} flexDirection="column" gap={6}>
                <Icon as={FaComments} w={16} h={16} color="whiteAlpha.300" />
                <Text color="whiteAlpha.700" fontSize="xl" textAlign="center">
                  No feedback found matching the selected filter.
                </Text>
              </Center>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={{ base: 6, md: 8 }}
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {feedback.map((item, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleFeedbackClick(item)}
                    cursor="pointer"
                    position="relative"
                    role="group"
                  >
                    {/* Glass Card */}
                    <Box
                      bg="rgba(13, 16, 33, 0.7)"
                      backdropFilter="blur(16px)"
                      borderRadius="2xl"
                      p={6}
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      transition="all 0.3s"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        borderColor: "blue.400",
                      }}
                      position="relative"
                      overflow="hidden"
                      height="280px"
                      display="flex"
                      flexDirection="column"
                    >
                      {/* Glow Effect */}
                      <Box
                        position="absolute"
                        top="-50%"
                        left="-50%"
                        width="200%"
                        height="200%"
                        background="radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, transparent 70%)"
                        opacity="0"
                        transition="opacity 0.3s"
                        _groupHover={{ opacity: "1" }}
                        pointerEvents="none"
                      />

                      <VStack align="stretch" spacing={4} flex={1}>
                        {/* Header */}
                        <Flex justify="space-between" align="center" minH="24px">
                          <HStack spacing={2}>
                            <Tag
                              size="sm"
                              variant="subtle"
                              colorScheme={getStatusColor(item.status)}
                              borderRadius="full"
                              px={3}
                              py={1}
                            >
                              {item.status}
                            </Tag>
                            {item.response && (
                              <Tag
                                size="sm"
                                variant="subtle"
                                colorScheme="blue"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                Answered
                              </Tag>
                            )}
                          </HStack>
                          <Text fontSize="sm" color="whiteAlpha.700" fontWeight="medium">
                            {getTimeAgo(item.timestamp)}
                          </Text>
                        </Flex>

                        {/* Rating */}
                        <HStack spacing={1} minH="16px">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icon
                              key={i}
                              as={FaStar}
                              w={4}
                              h={4}
                              color={i < item.rating ? "yellow.400" : "whiteAlpha.200"}
                              transition="color 0.2s"
                              _groupHover={{
                                color: i < item.rating ? "yellow.300" : "whiteAlpha.300"
                              }}
                            />
                          ))}
                        </HStack>

                        {/* Message */}
                        <Text
                          color="white"
                          fontSize="md"
                          noOfLines={3}
                          position="relative"
                          zIndex={1}
                          minH="72px"
                          maxH="72px"
                          overflow="hidden"
                          lineHeight="tall"
                        >
                          {item.message}
                        </Text>

                        {/* Response Preview */}
                        {item.response && (
                          <Box
                            bg="whiteAlpha.100"
                            p={4}
                            borderRadius="xl"
                            borderLeft="3px solid"
                            borderColor="blue.400"
                            minH="64px"
                            maxH="64px"
                            overflow="hidden"
                            transition="all 0.2s"
                            _groupHover={{
                              bg: "whiteAlpha.200",
                              borderColor: "blue.300"
                            }}
                          >
                            <Text
                              fontSize="sm"
                              color="whiteAlpha.900"
                              noOfLines={2}
                              lineHeight="tall"
                            >
                              {item.response}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  </MotionBox>
                ))}
              </SimpleGrid>
            )}
          </AnimatePresence>
        </Box>
      </VStack>

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