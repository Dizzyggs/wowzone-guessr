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
    <Container maxW="container.xl" py={16}>
      <VStack spacing={8}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading
            fontSize="5xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            mb={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Icon as={FaTrophy} w={12} h={12} color="blue.400" />
            Leaderboard
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Top players and their achievements
          </Text>
        </MotionBox>

        <HStack spacing={4} justify="center">
          <Button
            size="lg"
            variant={selectedMode === 'easy' ? 'solid' : 'outline'}
            colorScheme="blue"
            leftIcon={<Icon as={FaGamepad} />}
            onClick={() => setSelectedMode('easy')}
          >
            Multiple Choice
          </Button>
          <Button
            size="lg"
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
          p={6}
          border="2px solid"
          borderColor={selectedMode === 'easy' ? 'blue.400' : 'purple.500'}
          boxShadow="xl"
          overflow="hidden"
        >
          {error ? (
            <Text color="red.400" textAlign="center" fontSize="lg">
              {error}
            </Text>
          ) : (
            <Table variant="unstyled">
              <Thead>
                <Tr>
                  <Th color="gray.400" textAlign="center">Rank</Th>
                  <Th color="gray.400">Player</Th>
                  <Th color="gray.400" isNumeric>Score</Th>
                  <Th color="gray.400" isNumeric>Questions</Th>
                  <Th color="gray.400" isNumeric textAlign="right">Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Tr key={i}>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
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
                      <Td textAlign="center" position="relative">
                        {index <= 2 ? (
                          <Icon
                            as={FaMedal}
                            w={6}
                            h={6}
                            color={getMedalColor(index)}
                          />
                        ) : (
                          <Text color="gray.400">{index + 1}</Text>
                        )}
                      </Td>
                      <Td>
                        <Text color="white" fontWeight="bold">
                          {entry.playerName}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text color="yellow.400" fontWeight="bold">
                          {entry.score}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text color="green.400">
                          {entry.questionsAnswered}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text color="purple.400" textAlign="right">
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