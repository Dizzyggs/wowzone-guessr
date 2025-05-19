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
  Skeleton,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaTrophy, FaMedal, FaGamepad } from 'react-icons/fa'
import { getTopScores } from '../firebaseFunctions'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

interface LeaderboardEntry {
  playerName: string
  score: number
  questionsAnswered: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  timestamp: Date
}

const Leaderboard = () => {
  const [selectedMode, setSelectedMode] = useState<'easy' | 'hard'>('easy')
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchScores()
  }, [selectedMode])

  const fetchScores = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedScores = await getTopScores(selectedMode)
      setScores(fetchedScores)
    } catch (err) {
      setError('Failed to load leaderboard data')
      console.error('Error fetching scores:', err)
    }
    setIsLoading(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
          {error ? (
            <Text color="red.400" textAlign="center" fontSize="lg">
              {error}
            </Text>
          ) : (
            <Table variant="unstyled" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th color="gray.400" textAlign="center" px={{ base: 2, md: 6 }}>Rank</Th>
                  <Th color="gray.400" px={{ base: 2, md: 6 }}>Player</Th>
                  <Th color="gray.400" isNumeric px={{ base: 2, md: 6 }}>Score</Th>
                  <Th color="gray.400" isNumeric display={{ base: "none", md: "table-cell" }}>Questions</Th>
                  <Th color="gray.400" isNumeric textAlign="right" display={{ base: "none", md: "table-cell" }}>Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Tr key={i}>
                      <Td px={{ base: 2, md: 6 }}><Skeleton height="20px" /></Td>
                      <Td px={{ base: 2, md: 6 }}><Skeleton height="20px" /></Td>
                      <Td px={{ base: 2, md: 6 }}><Skeleton height="20px" /></Td>
                      <Td display={{ base: "none", md: "table-cell" }}><Skeleton height="20px" /></Td>
                      <Td display={{ base: "none", md: "table-cell" }}><Skeleton height="20px" /></Td>
                    </Tr>
                  ))
                ) : scores.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" color="gray.400">
                      No scores yet. Be the first to play!
                    </Td>
                  </Tr>
                ) : (
                  scores.map((entry, index) => (
                    <MotionTr
                      key={`${entry.playerName}-${entry.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      bg={index % 2 === 0 ? 'rgba(66, 153, 225, 0.1)' : 'transparent'}
                      _hover={{ bg: 'rgba(66, 153, 225, 0.2)' }}
                    >
                      <Td textAlign="center" position="relative" px={{ base: 2, md: 6 }}>
                        {index <= 2 ? (
                          <Icon
                            as={FaMedal}
                            w={{ base: 5, md: 6 }}
                            h={{ base: 5, md: 6 }}
                            color={getMedalColor(index)}
                          />
                        ) : (
                          <Text color="gray.400">{index + 1}</Text>
                        )}
                      </Td>
                      <Td px={{ base: 2, md: 6 }}>
                        <Text color="white" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                          {entry.playerName}
                        </Text>
                      </Td>
                      <Td isNumeric px={{ base: 2, md: 6 }}>
                        <Text color="yellow.400" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                          {entry.score}
                        </Text>
                      </Td>
                      <Td isNumeric display={{ base: "none", md: "table-cell" }}>
                        <Text color="green.400">
                          {entry.questionsAnswered}
                        </Text>
                      </Td>
                      <Td isNumeric textAlign="right" display={{ base: "none", md: "table-cell" }}>
                        <Text color="blue.400">
                          {formatTime(entry.timeElapsed)}
                        </Text>
                      </Td>
                    </MotionTr>
                  ))
                )}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>
    </Container>
  )
}

export default Leaderboard 