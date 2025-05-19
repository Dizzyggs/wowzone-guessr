import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Input,
  Divider,
  keyframes,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaTrophy, FaClock, FaCheck, FaUser, FaRocket } from 'react-icons/fa'
import { checkAndStoreScore } from '../firebaseFunctions'
import GameNotification from './GameNotification'
import { calculateTimeBonus } from '../utils/scoring'

const MotionModalContent = motion(ModalContent)

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(236, 201, 75, 0.4), 0 0 20px rgba(236, 201, 75, 0.2); }
  50% { box-shadow: 0 0 15px rgba(236, 201, 75, 0.5), 0 0 30px rgba(236, 201, 75, 0.3); }
  100% { box-shadow: 0 0 10px rgba(236, 201, 75, 0.4), 0 0 20px rgba(236, 201, 75, 0.2); }
`

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  questionsAnswered: number
  score: number
  timeElapsed: number
  mode: 'easy' | 'hard'
}

const ResultsModal = ({ isOpen, onClose, questionsAnswered, score, timeElapsed, mode }: ResultsModalProps) => {
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <MotionModalContent
        bg="rgba(10, 15, 28, 0.95)"
        p={6}
        border="2px solid"
        borderColor="blue.400"
        boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <ModalHeader
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          pb={6}
        >
          Game Results
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" p={4} bg="rgba(66, 153, 225, 0.1)" borderRadius="lg">
              <HStack>
                <Icon as={FaCheck} color="green.400" w={6} h={6} />
                <Text color="white" fontSize="lg">Base Score</Text>
              </HStack>
              <Text color="white" fontSize="xl" fontWeight="bold">{baseScore}</Text>
            </HStack>

            {timeBonus.bonus > 0 && (
              <HStack justify="space-between" p={4} bg="rgba(147, 51, 234, 0.1)" borderRadius="lg">
                <HStack>
                  <Icon as={FaRocket} color="purple.400" w={6} h={6} />
                  <Text color="white" fontSize="lg">Time Bonus</Text>
                </HStack>
                <Text color="purple.400" fontSize="xl" fontWeight="bold">
                  +{timeBonus.bonus}
                </Text>
              </HStack>
            )}

            <Divider borderColor="whiteAlpha.200" />

            <HStack 
              justify="space-between" 
              p={4} 
              bg="rgba(66, 153, 225, 0.2)" 
              borderRadius="lg"
              border="2px solid"
              borderColor="yellow.400"
              animation={`${glowAnimation} 2s infinite`}
              style={{
                willChange: 'box-shadow'
              }}
            >
              <HStack>
                <Icon as={FaTrophy} color="yellow.400" w={6} h={6} />
                <Text color="white" fontSize="lg">Total Score</Text>
              </HStack>
              <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{score}</Text>
            </HStack>

            <HStack justify="space-between" p={4} bg="rgba(66, 153, 225, 0.1)" borderRadius="lg">
              <HStack>
                <Icon as={FaCheck} color="green.400" w={6} h={6} />
                <Text color="white" fontSize="lg">Questions</Text>
              </HStack>
              <Text color="white" fontSize="xl" fontWeight="bold">{questionsAnswered}</Text>
            </HStack>

            <HStack justify="space-between" p={4} bg="rgba(66, 153, 225, 0.1)" borderRadius="lg">
              <HStack>
                <Icon as={FaClock} color="purple.400" w={6} h={6} />
                <Text color="white" fontSize="lg">Time</Text>
              </HStack>
              <Text color="white" fontSize="xl" fontWeight="bold">{formatTime(timeElapsed)}</Text>
            </HStack>

            {timeBonus.bonus > 0 && (
              <Text color="purple.400" fontSize="md" textAlign="center" fontStyle="italic">
                Bonus points for {timeBonus.message}!
              </Text>
            )}

            {!hasSubmitted && (
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Icon as={FaUser} color="blue.400" w={5} h={5} />
                  <Text color="white" fontSize="md">Enter your name to save score:</Text>
                </HStack>
                <Input
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  bg="rgba(66, 153, 225, 0.1)"
                  border="2px solid"
                  borderColor="blue.400"
                  color="white"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.300", boxShadow: "none" }}
                />
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter gap={4}>
          {!hasSubmitted && (
            <Button
              colorScheme="blue"
              onClick={handleSubmitScore}
              isLoading={isSubmitting}
              loadingText="Saving..."
              leftIcon={<Icon as={FaTrophy} />}
            >
              Save Score
            </Button>
          )}
          <Button variant="ghost" color="white" onClick={onClose}>
            {hasSubmitted ? 'Close' : 'Skip'}
          </Button>
        </ModalFooter>
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