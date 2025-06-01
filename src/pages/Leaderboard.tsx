import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  Grid,
  Flex,
  IconButton,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrophy, FaGamepad, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaMedal, FaClock, FaCheck, FaSearch } from 'react-icons/fa'
import { getTopScores } from '../firebaseFunctions'
import React from 'react'

const MotionBox = motion(Box)
// const MotionFlex = motion(Flex)

// Add custom scrollbar styles
const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
}

interface LeaderboardEntry {
  playerName: string
  score: number
  questionsAnswered: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  timestamp: any
  originalIndex?: number
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  range.push(1);
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }
  if (totalPages > 1) {
    range.push(totalPages);
  }
  let l;
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (timestamp: any): string => {
  if (!timestamp) return '-';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const getMedalColor = (index: number): string => {
  switch (index) {
    case 0: return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    case 1: return 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)'
    case 2: return 'linear-gradient(135deg, #CD7F32 0%, #A05A2C 100%)'
    default: return 'transparent'
  }
}

const LeaderboardCard = motion(React.forwardRef<HTMLDivElement, { entry: LeaderboardEntry, index: number, isEvenRow: boolean }>(({ entry, index }, ref) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const actualIndex = entry.originalIndex ?? index
  const isTopThree = actualIndex <= 2
  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      bg={isTopThree ? 'rgba(13, 16, 33, 0.95)' : 'rgba(13, 16, 33, 0.7)'}
      borderRadius="xl"
      p={{ base: 3, md: 4 }}
      border="1px solid"
      borderColor={isTopThree ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
      boxShadow={isTopThree ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)'}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isTopThree ? getMedalColor(actualIndex) : 'transparent',
        opacity: 0.1,
        borderRadius: 'xl',
      }}
    >
      <Grid 
        templateColumns={{ base: "auto 1fr auto", md: "0.5fr 2fr 1fr 1fr 1fr" }} 
        gap={{ base: 3, md: 4 }} 
        alignItems="center"
      >
        {/* Rank */}
        <Center>
          {actualIndex <= 2 ? (
            <Icon 
              as={FaMedal} 
              w={{ base: 6, md: 8 }} 
              h={{ base: 6, md: 8 }} 
              color={getMedalColor(actualIndex)} 
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />
          ) : (
            <Text 
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="bold" 
              color="whiteAlpha.700"
            >
              #{actualIndex + 1}
            </Text>
          )}
        </Center>

        {/* Player Name */}
        <Box>
          <Text 
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold" 
            color={isTopThree ? "white" : "whiteAlpha.900"}
          >
            {entry.playerName}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="whiteAlpha.700">
            {formatDate(entry.timestamp)}
          </Text>
        </Box>

        {/* Score - Always visible */}
        <HStack spacing={{ base: 1, md: 2 }} justify={{ base: "flex-end", md: "center" }}>
          <Icon as={FaTrophy} color="yellow.400" w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="yellow.400">
            {entry.score}
          </Text>
          {isMobile && (
            <VStack spacing={0} align="flex-start" fontSize="xs" color="whiteAlpha.600" ml={2}>
              <HStack spacing={1}>
                <Icon as={FaCheck} w={3} h={3} />
                <Text>{entry.questionsAnswered}</Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaClock} w={3} h={3} />
                <Text>{formatTime(entry.timeElapsed)}</Text>
              </HStack>
            </VStack>
          )}
        </HStack>

        {/* Questions - Desktop only */}
        {!isMobile && (
          <HStack spacing={2} justify="center">
            <Icon as={FaCheck} color="green.400" />
            <Text color="whiteAlpha.900">
              {entry.questionsAnswered}
            </Text>
          </HStack>
        )}

        {/* Time - Desktop only */}
        {!isMobile && (
          <HStack spacing={2} justify="center">
            <Icon as={FaClock} color="purple.400" />
            <Text color="whiteAlpha.900">
              {formatTime(entry.timeElapsed)}
            </Text>
          </HStack>
        )}
      </Grid>
    </MotionBox>
  )
}))

const Leaderboard = () => {
  const [selectedMode, setSelectedMode] = useState<'easy' | 'hard'>('easy')
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useBreakpointValue({ base: true, md: false })
  const itemsPerPage = 10

  // Load all scores once when mode changes
  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true)
      try {
        const scoresData = await getTopScores(selectedMode)
        setAllScores(scoresData)
      } catch (error) {
        console.error('Error loading scores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadScores()
  }, [selectedMode])

  // Filter scores based on search query with debounce
  const filteredScores = useMemo(() => {
    setIsSearching(true)
    const query = searchQuery.toLowerCase().trim()
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsSearching(false)
    }, 300)

    if (!query) return allScores

    return allScores.map((score, index) => ({
      ...score,
      originalIndex: index
    })).filter(score => 
      score.playerName.toLowerCase().includes(query)
    )
  }, [searchQuery, allScores])

  // Get current page scores
  const currentScores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredScores.slice(startIndex, endIndex)
  }, [currentPage, filteredScores])

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredScores.length / itemsPerPage)
  , [filteredScores])

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true)
    const value = e.target.value
    setSearchQuery(value)
    
    // Clear any existing timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout)
    }
    
    // Set new timeout
    (window as any).searchTimeout = setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }

  const showNoResults = !isLoading && !isSearching && currentScores.length === 0

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 16 }} px={{ base: 2, md: 4 }}>
      <VStack spacing={{ base: 4, md: 10 }} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align={{ base: "stretch", md: "center" }}
            justify="space-between"
            gap={{ base: 3, md: 4 }}
          >
            <Heading
              fontSize={{ base: "2xl", md: "5xl" }}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              display="flex"
              alignItems="center"
              gap={{ base: 2, md: 4 }}
            >
              <Icon as={FaTrophy} color="blue.400" w={{ base: 6, md: 8 }} h={{ base: 6, md: 8 }} />
              Hall of Fame
            </Heading>

            <Flex 
              gap={4} 
              direction={{ base: "column", md: "row" }}
              align={{ base: "stretch", md: "center" }}
            >
              {!isMobile && (
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="whiteAlpha.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search player..."
                    value={searchQuery}
                    onChange={handleSearch}
                    bg="rgba(0, 0, 0, 0.2)"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    _placeholder={{ color: 'whiteAlpha.400' }}
                    _hover={{ borderColor: 'whiteAlpha.300' }}
                    _focus={{ 
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                    }}
                  />
                </InputGroup>
              )}

              <ButtonGroup 
                size={{ base: "sm", md: "lg" }}
                isAttached
                variant="outline"
                borderRadius="full"
                borderWidth={2}
                borderColor="whiteAlpha.200"
                p={1}
                bg="rgba(0, 0, 0, 0.2)"
              >
                <Button
                  variant={selectedMode === 'easy' ? 'solid' : 'ghost'}
                  onClick={() => setSelectedMode('easy')}
                  leftIcon={<Icon as={FaGamepad} />}
                  color={selectedMode === 'easy' ? 'white' : 'whiteAlpha.700'}
                  bg={selectedMode === 'easy' ? 'blue.500' : 'transparent'}
                  _hover={{
                    bg: selectedMode === 'easy' ? 'blue.600' : 'whiteAlpha.100'
                  }}
                  borderRadius="full"
                >
                  Multiple Choice
                </Button>
                <Button
                  variant={selectedMode === 'hard' ? 'solid' : 'ghost'}
                  onClick={() => setSelectedMode('hard')}
                  leftIcon={<Icon as={FaGamepad} />}
                  color={selectedMode === 'hard' ? 'white' : 'whiteAlpha.700'}
                  bg={selectedMode === 'hard' ? 'purple.500' : 'transparent'}
                  _hover={{
                    bg: selectedMode === 'hard' ? 'purple.600' : 'whiteAlpha.100'
                  }}
                  borderRadius="full"
                >
                  Manual Input
                </Button>
              </ButtonGroup>
            </Flex>
          </Flex>
        </MotionBox>

        {/* Leaderboard Content */}
        <Box
          bg="rgba(0, 0, 0, 0.3)"
          borderRadius="2xl"
          p={{ base: 4, md: 8 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          boxShadow="dark-lg"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        >
          {isLoading || isSearching ? (
            <Center py={16}>
              <VStack spacing={4}>
                <Spinner 
                  size="xl" 
                  color="blue.400" 
                  thickness="4px"
                  speed="0.8s"
                  emptyColor="whiteAlpha.100"
                />
                <Text color="whiteAlpha.600">
                  {isSearching ? "Searching..." : "Loading scores..."}
                </Text>
              </VStack>
            </Center>
          ) : showNoResults ? (
            <Center py={16}>
              <VStack spacing={4}>
                <Icon as={FaTrophy} w={12} h={12} color="whiteAlpha.300" />
                <Text color="whiteAlpha.600" fontSize="lg" textAlign="center">
                  {searchQuery.trim() 
                    ? `No players found matching "${searchQuery}"`
                    : "No scores recorded yet. Be the first!"}
                </Text>
              </VStack>
            </Center>
          ) : (
            <VStack 
              spacing={4} 
              align="stretch"
              maxH="800px"
              overflowY="auto"
              pr={2}
              sx={scrollbarStyles}
              overflow={"hidden"}
              px={2}
            >
              <AnimatePresence mode="wait">
                {currentScores.map((entry, index) => {
                  const absoluteIndex = entry.originalIndex ?? ((currentPage - 1) * itemsPerPage + index);
                  return (
                    <LeaderboardCard
                      key={`${entry.playerName}-${absoluteIndex}`}
                      entry={entry}
                      index={absoluteIndex}
                      isEvenRow={index % 2 === 0}
                    />
                  );
                })}
              </AnimatePresence>
            </VStack>
          )}

          {/* Pagination - Only show if we have results and more than one page */}
          {!showNoResults && totalPages > 1 && (
            <Flex justify="center" mt={8}>
              <ButtonGroup variant="outline" spacing={2} alignItems="center">
                <IconButton
                  aria-label="First page"
                  icon={<Icon as={FaAngleDoubleLeft} />}
                  onClick={() => handlePageChange(1)}
                  isDisabled={currentPage === 1}
                  size="sm"
                  variant="ghost"
                  color="whiteAlpha.700"
                  _hover={{ bg: 'whiteAlpha.100' }}
                />
                <IconButton
                  aria-label="Previous page"
                  icon={<Icon as={FaChevronLeft} />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  size="sm"
                  variant="ghost"
                  color="whiteAlpha.700"
                  _hover={{ bg: 'whiteAlpha.100' }}
                />
                
                {getPageNumbers(currentPage, totalPages).map((pageNum, index) => (
                  pageNum === '...' ? (
                    <Text key={`dots-${index}`} color="whiteAlpha.400" px={2}>...</Text>
                  ) : (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(Number(pageNum))}
                      variant={currentPage === pageNum ? 'solid' : 'ghost'}
                      bg={currentPage === pageNum ? 'whiteAlpha.200' : 'transparent'}
                      color="white"
                      size="sm"
                      minW="32px"
                      _hover={{ bg: 'whiteAlpha.100' }}
                    >
                      {pageNum}
                    </Button>
                  )
                ))}

                <IconButton
                  aria-label="Next page"
                  icon={<Icon as={FaChevronRight} />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  size="sm"
                  variant="ghost"
                  color="whiteAlpha.700"
                  _hover={{ bg: 'whiteAlpha.100' }}
                />
                <IconButton
                  aria-label="Last page"
                  icon={<Icon as={FaAngleDoubleRight} />}
                  onClick={() => handlePageChange(totalPages)}
                  isDisabled={currentPage === totalPages}
                  size="sm"
                  variant="ghost"
                  color="whiteAlpha.700"
                  _hover={{ bg: 'whiteAlpha.100' }}
                />
              </ButtonGroup>
            </Flex>
          )}
        </Box>
      </VStack>
    </Container>
  )
}

export default Leaderboard