import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Input,
  Flex,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaTrophy, FaClock, FaCheck, FaForward, FaMedal } from 'react-icons/fa'
import { checkAndStoreScore, getTopScores } from '../firebaseFunctions'
import GameNotification from './GameNotification'
import { calculateTimeBonus } from '../utils/scoring'

const MotionModalContent = motion(ModalContent)

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  questionsAnswered: number
  score: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  skippedQuestions: number
}

const ResultsModal = ({ isOpen, onClose, questionsAnswered, score, timeElapsed, mode, skippedQuestions }: ResultsModalProps) => {
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
  const [potentialRank, setPotentialRank] = useState<{ rank: number; total: number } | null>(null)
  const [isLoadingRank, setIsLoadingRank] = useState(true)

  useEffect(() => {
    const calculatePotentialRank = async () => {
      setIsLoadingRank(true)
      try {
        const scores = await getTopScores(mode)
        let rank = 1
        for (const entry of scores) {
          if (score <= entry.score) {
            rank++
          }
        }
        setPotentialRank({ rank, total: scores.length + 1 })
      } catch (error) {
        console.error('Error calculating potential rank:', error)
      }
      setIsLoadingRank(false)
    }

    if (isOpen) {
      calculatePotentialRank()
    }
  }, [isOpen, score, mode])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const showGameNotification = (text: string, type: 'success' | 'error') => {
    setNotificationText(text)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      showGameNotification('Please enter your name to save your score.', 'error')
      return
    }

    setIsSubmitting(true)
    const result = await checkAndStoreScore({
      playerName: playerName.trim(),
      score,
      questionsAnswered,
      timeElapsed,
      mode,
    })

    showGameNotification(result.message, result.success ? 'success' : 'error')
    setIsSubmitting(false)
    setHasSubmitted(true)
    
    if (result.success) {
      setTimeout(onClose, 2000)
    }
  }

  const timeBonus = calculateTimeBonus(timeElapsed)
  const baseScore = score - timeBonus.bonus

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <MotionModalContent
        bg="rgba(10, 15, 28, 0.97)"
        border="2px solid"
        borderColor="blue.400"
        boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Title and Rank */}
            <VStack spacing={4} align="center">
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Game Results
              </Text>
              
              <HStack 
                justify="center"
                p={3}
                px={6}
                bg="rgba(236, 201, 75, 0.1)"
                borderRadius="full"
                border="2px solid"
                borderColor="yellow.400"
              >
                <Icon as={FaMedal} color="yellow.400" w={5} h={5} />
                {isLoadingRank ? (
                  <Spinner color="yellow.400" size="sm" />
                ) : potentialRank ? (
                  <Flex align="center" gap={2}>
                    <Text color="yellow.400" fontSize="xl" fontWeight="bold">
                      #{potentialRank.rank}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      of {potentialRank.total}
                    </Text>
                  </Flex>
                ) : (
                  <Text color="gray.400" fontSize="sm">Unable to calculate</Text>
                )}
              </HStack>
            </VStack>

            {/* Score Section */}
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={3}
              bg="rgba(0, 0, 0, 0.2)"
              p={4}
              borderRadius="xl"
            >
              <GridItem>
                <Text color="gray.400" fontSize="sm">Base Score</Text>
                <Text color="white" fontSize="xl" fontWeight="bold">{baseScore}</Text>
              </GridItem>
              {timeBonus.bonus > 0 && (
                <GridItem>
                  <Text color="gray.400" fontSize="sm">Time Bonus</Text>
                  <Text color="purple.400" fontSize="xl" fontWeight="bold">+{timeBonus.bonus}</Text>
                </GridItem>
              )}
              <GridItem colSpan={2}>
                <Text color="gray.400" fontSize="sm">Total Score</Text>
                <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{score}</Text>
              </GridItem>
            </Grid>

            {/* Stats Grid */}
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={3}
              bg="rgba(0, 0, 0, 0.2)"
              p={4}
              borderRadius="xl"
            >
              <GridItem>
                <HStack>
                  <Icon as={FaCheck} color="green.400" w={4} h={4} />
                  <Text color="gray.400" fontSize="sm">Answered</Text>
                </HStack>
                <Text color="white" fontSize="lg" fontWeight="bold" ml={6}>{questionsAnswered}</Text>
              </GridItem>
              <GridItem>
                <HStack>
                  <Icon as={FaForward} color="gray.400" w={4} h={4} />
                  <Text color="gray.400" fontSize="sm">Skipped</Text>
                </HStack>
                <Text color="white" fontSize="lg" fontWeight="bold" ml={6}>{skippedQuestions}</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack>
                  <Icon as={FaClock} color="purple.400" w={4} h={4} />
                  <Text color="gray.400" fontSize="sm">Time</Text>
                </HStack>
                <Text color="white" fontSize="lg" fontWeight="bold" ml={6}>
                  {formatTime(timeElapsed)}
                  {timeBonus.bonus > 0 && (
                    <Text as="span" color="purple.400" fontSize="sm" ml={2}>
                      ({timeBonus.message})
                    </Text>
                  )}
                </Text>
              </GridItem>
            </Grid>

            {/* Save Score Section */}
            {!hasSubmitted && (
              <VStack spacing={3} align="stretch">
                <Input
                  placeholder="Enter your name to save score"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  bg="rgba(66, 153, 225, 0.1)"
                  border="2px solid"
                  borderColor="blue.400"
                  color="white"
                  size="lg"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.300", boxShadow: "none" }}
                />
                <HStack>
                  <Button
                    colorScheme="blue"
                    onClick={handleSubmitScore}
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    leftIcon={<Icon as={FaTrophy} />}
                    flex={1}
                    size="lg"
                  >
                    Save Score
                  </Button>
                  <Button variant="ghost" color="white" onClick={onClose} size="lg">
                    Skip
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>
      </MotionModalContent>

      {showNotification && (
        <GameNotification
          message={notificationText}
          type={notificationType}
          isVisible={showNotification}
        />
      )}
    </Modal>
  )
}

export default ResultsModal 