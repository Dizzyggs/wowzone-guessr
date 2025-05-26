import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  TableContainer,
  IconButton,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaTrophy, FaGamepad, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaMedal } from 'react-icons/fa'
import { getTopScores } from '../firebaseFunctions'

const MotionBox = motion(Box)
// const MotionTr = motion(Tr)

// Add custom scrollbar styles
const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  'msOverflowStyle': 'none',  // IE and Edge
  'scrollbarWidth': 'none',  // Firefox
}

interface LeaderboardEntry {
  playerName: string
  score: number
  questionsAnswered: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  timestamp: any // Firestore timestamp
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const delta = 2; // Number of pages to show before and after current page
  const range = [];
  const rangeWithDots = [];

  // Always show first page
  range.push(1);

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  // Always show last page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Add the page numbers with dots
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

const Leaderboard = () => {
  const [selectedMode, setSelectedMode] = useState<'easy' | 'hard'>('easy')
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true)
      try {
        const scoresData = await getTopScores(selectedMode)
        setScores(scoresData)
        setTotalPages(Math.ceil(scoresData.length / itemsPerPage))
        setCurrentPage(1) // Reset to first page when mode changes
      } catch (error) {
        console.error('Error loading scores:', error)
      }
      setIsLoading(false)
    }

    loadScores()
  }, [selectedMode])

  // Get current page's scores
  const getCurrentPageScores = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return scores.slice(startIndex, endIndex)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to top of the list smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '-';
    
    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return '#FFD700' // Gold
      case 1: return '#C0C0C0' // Silver
      case 2: return '#CD7F32' // Bronze
      default: return 'transparent'
    }
  }

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
      <VStack spacing={{ base: 4, md: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            mb={{ base: 2, md: 4 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={{ base: 2, md: 4 }}
          >
            <Icon as={FaTrophy} w={{ base: 8, md: 12 }} h={{ base: 8, md: 12 }} color="blue.400" />
            Leaderboard
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.400">
            Top players and their achievements
          </Text>
        </MotionBox>

        <HStack spacing={{ base: 2, md: 4 }} justify="center">
          <Button
            size={{ base: "md", md: "lg" }}
            variant={selectedMode === 'easy' ? 'solid' : 'outline'}
            colorScheme="blue"
            leftIcon={<Icon as={FaGamepad} />}
            onClick={() => setSelectedMode('easy')}
          >
            Multiple Choice
          </Button>
          <Button
            size={{ base: "md", md: "lg" }}
            variant={selectedMode === 'hard' ? 'solid' : 'outline'}
            colorScheme="purple"
            leftIcon={<Icon as={FaGamepad} />}
            onClick={() => setSelectedMode('hard')}
          >
            Manual Input
          </Button>
        </HStack>

        <Box
          w="full"
          bg="rgba(10, 15, 28, 0.95)"
          borderRadius="xl"
          p={{ base: 2, md: 6 }}
          border="2px solid"
          borderColor={selectedMode === 'easy' ? 'blue.400' : 'purple.500'}
          boxShadow="xl"
          overflow={{ base: "auto", md: "hidden" }}
        >
          {isLoading ? (
            <Center py={8}>
              <Spinner size="xl" color="blue.400" thickness="4px" />
            </Center>
          ) : scores.length === 0 ? (
            <Text color="gray.400" fontSize="lg">No scores recorded yet.</Text>
          ) : (
            <>
              <TableContainer 
                width="100%" 
                overflowY="auto" 
                maxH="600px"
                sx={scrollbarStyles}
              >
                <Table variant="simple">
                  <Thead position="sticky" top={0} bg="gray.900" zIndex={1}>
                    <Tr>
                      <Th color="gray.400" textAlign="center">Rank</Th>
                      <Th color="gray.400">Player</Th>
                      <Th color="gray.400" isNumeric>Score</Th>
                      <Th color="gray.400" isNumeric display={{ base: 'none', md: 'table-cell' }}>Questions</Th>
                      <Th color="gray.400" isNumeric display={{ base: 'none', md: 'table-cell' }}>Time</Th>
                      <Th color="gray.400" display={{ base: 'none', md: 'table-cell' }}>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getCurrentPageScores().map((entry, index) => {
                      const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
                      const medalColor = getMedalColor(absoluteIndex);
                      
                      return (
                        <Tr 
                          key={`${entry.playerName}-${index}`}
                          bg={absoluteIndex % 2 === 0 ? 'whiteAlpha.50' : 'transparent'}
                          transition="all 0.2s"
                          _hover={{
                            bg: 'whiteAlpha.100',
                            transform: 'translateX(4px)'
                          }}
                        >
                          <Td textAlign="center" position="relative">
                            {absoluteIndex <= 2 ? (
                              <Icon 
                                as={FaMedal} 
                                w={6} 
                                h={6} 
                                color={medalColor}
                                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                              />
                            ) : (
                              <Text>{absoluteIndex + 1}</Text>
                            )}
                          </Td>
                          <Td fontWeight={absoluteIndex <= 2 ? "bold" : "normal"} color={absoluteIndex <= 2 ? "blue.300" : "white"}>
                            {entry.playerName}
                          </Td>
                          <Td isNumeric fontWeight="bold" color={absoluteIndex <= 2 ? "blue.300" : "white"}>
                            {entry.score}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {entry.questionsAnswered}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {formatTime(entry.timeElapsed)}
                          </Td>
                          <Td display={{ base: 'none', md: 'table-cell' }}>
                            {formatDate(entry.timestamp)}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <HStack spacing={2} justify="center" width="100%" pt={6}>
                  <ButtonGroup variant="outline" spacing={2} alignItems="center">
                    <IconButton
                      aria-label="First page"
                      icon={<Icon as={FaAngleDoubleLeft} />}
                      onClick={() => handlePageChange(1)}
                      isDisabled={currentPage === 1}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    />
                    <IconButton
                      aria-label="Previous page"
                      icon={<Icon as={FaChevronLeft} />}
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    />
                    
                    {getPageNumbers(currentPage, totalPages).map((pageNum, index) => (
                      pageNum === '...' ? (
                        <Text key={`dots-${index}`} color="gray.500" px={2}>...</Text>
                      ) : (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(Number(pageNum))}
                          variant={currentPage === pageNum ? 'solid' : 'ghost'}
                          colorScheme="blue"
                          size="sm"
                          minW="32px"
                          _hover={{ bg: 'whiteAlpha.200' }}
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
                      colorScheme="blue"
                      variant="ghost"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    />
                    <IconButton
                      aria-label="Last page"
                      icon={<Icon as={FaAngleDoubleRight} />}
                      onClick={() => handlePageChange(totalPages)}
                      isDisabled={currentPage === totalPages}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    />
                  </ButtonGroup>
                </HStack>
              )}
            </>
          )}
        </Box>
      </VStack>
    </Container>
  )
}

export default Leaderboard 