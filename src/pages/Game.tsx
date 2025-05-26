import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Image,
  Input,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { getZonesByContinent, getZoneNames, type Zone } from '../data/zones'
import { preloadImages, getZoneImagePath } from '../utils/imagePreloader'
import GameNotification from '../components/GameNotification'
import ScoreCounter from '../components/ScoreCounter'
import GameTimer from '../components/GameTimer'
import ResultsModal from '../components/ResultsModal'
import ReadyModal from '../components/ReadyModal'
import ZoomWarning from '../components/ZoomWarning'
import { FaForward } from 'react-icons/fa'
import './Game.scss'

const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionImage = motion(Image)

// Add a styled container for the buttons
const MotionButtonContainer = motion(Box)

// Add animation variants for the button container
const buttonContainerVariants = {
  initial: {
    opacity: 0.5,
    y: 0,
  },
  hover: {
    opacity: 1,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

interface GameState {
  score: number
  lives: number
  currentZone: Zone | null
  currentImage: string
  usedZones: Set<string>
  skippedZones: Set<string>
  isMultipleChoice: boolean
  options: Zone[]
  imageKey: number
  isAnswering: boolean
  correctAnswer: string | null
  inputDisabled: boolean
  gameTime: number
  showResults: boolean
  isReady: boolean
  questionsAnswered: number
}

const Game = () => {
  const { mode } = useParams()
  const navigate = useNavigate()
  
  // Multiple choice mode is when mode is 'easy'
  const isMultipleChoice = mode === 'easy'
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: isMultipleChoice ? 1 : 2,
    currentZone: null,
    currentImage: '',
    usedZones: new Set(),
    skippedZones: new Set(),
    isMultipleChoice,
    options: [],
    imageKey: 0,
    isAnswering: false,
    correctAnswer: null,
    inputDisabled: false,
    gameTime: 0,
    showResults: false,
    isReady: false,
    questionsAnswered: 0
  })

  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success')
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Get all available zones
  const availableZones = [
    ...getZonesByContinent('Eastern Kingdoms'),
    ...getZonesByContinent('Kalimdor'),
    ...getZonesByContinent('TBC')
  ]

  const getRandomOptions = (correctZone: Zone): Zone[] => {
    // Get all zones except the correct one
    const otherZones = availableZones.filter(zone => zone.id !== correctZone.id)
    const shuffled = otherZones.sort(() => Math.random() - 0.5)
    const options = [correctZone, ...shuffled.slice(0, 3)]
    const finalOptions = options.sort(() => Math.random() - 0.5)
    return finalOptions
  }

  useEffect(() => {
    if (!mode) {
      navigate('/play')
      return
    }
    getNextZone()
  }, [mode])

  const getNextZone = () => {
    if (!availableZones.length) {
      navigate('/play')
      return
    }

    const unusedZones = availableZones.filter(zone => !gameState.usedZones.has(zone.id))

    if (unusedZones.length === 0) {
      setGameState(prev => ({ 
        ...prev, 
        showResults: true,
        isAnswering: true
      }))
      return
    }

    const randomZone = unusedZones[Math.floor(Math.random() * unusedZones.length)]
    const options = isMultipleChoice ? getRandomOptions(randomZone) : []
    
    // Get the image path
    const imagePath = getZoneImagePath(randomZone)

    setGameState(prev => ({
      ...prev,
      currentZone: randomZone,
      currentImage: imagePath,
      options,
      usedZones: new Set([...prev.usedZones, randomZone.id]),
      imageKey: prev.imageKey + 1,
      lives: isMultipleChoice ? 1 : 2 // Reset lives for each new question
    }))

    // Preload next batch of images
    const remainingZones = unusedZones.filter(zone => zone.id !== randomZone.id)
    preloadImages(remainingZones)
  }

  const showGameNotification = (text: string, type: 'success' | 'error' | 'info') => {
    setNotificationText(text)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const handleGuess = (guess: string) => {
    if (!gameState.currentZone || gameState.inputDisabled) return

    const isCorrect = guess.toLowerCase() === gameState.currentZone.name.toLowerCase()

    if (isCorrect) {
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + (isMultipleChoice ? 100 : 150),
        questionsAnswered: prev.questionsAnswered + 1 
      }))
      const randomCheer = ['Nice!', 'Good job!', 'Great!', 'Awesome!', 'Perfect!']
      const random = randomCheer[Math.floor(Math.random() * randomCheer.length)]
      showGameNotification(random, 'success')
      getNextZone()
    } else {
      setGameState(prev => ({ 
        ...prev, 
        lives: prev.lives - 1,
        isAnswering: true,
        correctAnswer: gameState.currentZone?.name || '',
        inputDisabled: true
      }))
      
      if (isMultipleChoice) {
        const zoneName = gameState.currentZone?.name || 'Unknown'
        showGameNotification(`Wrong! The zone was ${zoneName}`, 'error')
        setTimeout(() => {
          getNextZone()
          setGameState(prev => ({ 
            ...prev, 
            isAnswering: false,
            correctAnswer: null,
            inputDisabled: false
          }))
        }, 2000)
      } else {
        if (gameState.lives > 1) {
          showGameNotification("Wrong! Try again!", 'error')
          setTimeout(() => {
            setGameState(prev => ({ 
              ...prev, 
              isAnswering: false,
              inputDisabled: false
            }))
            setInput('')
          }, 1000)
        } else {
          const zoneName = gameState.currentZone?.name || 'Unknown'
          showGameNotification(`Wrong! The zone was ${zoneName}. -50 points`, 'error')
          setTimeout(() => {
            setGameState(prev => ({ 
              ...prev,
              score: Math.max(0, prev.score - 50), // Prevent score from going below 0
              lives: 2, // Reset lives
              isAnswering: false,
              correctAnswer: null,
              inputDisabled: false
            }))
            getNextZone()
            setInput('')
          }, 2000)
        }
      }
    }
    setInput('')
  }

  // const isMobile = useBreakpointValue({ base: true, md: false })

  // Add this function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    
    if (value.length > 0) {
      const zoneNames = getZoneNames()
      const filtered = zoneNames
        .filter(name => 
          name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  // Add this function to handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setSuggestions([])
    handleGuess(suggestion)
  }

  const handleGameStart = () => {
    setGameState(prev => ({ ...prev, isReady: true }))
    getNextZone()
  }

  const handleSkip = () => {
    if (!gameState.currentZone) return;
    
    setGameState(prev => ({
      ...prev,
      skippedZones: new Set([...prev.skippedZones, prev.currentZone!.name])
    }));

    // Show notification
    showGameNotification('Question skipped', 'info');

    // Load next question
    getNextZone();
  };

  return (
    <Container maxW="container.xl" py={4} position="relative">
      <VStack spacing={4} align="stretch">
        {/* Score and Lives */}
        <Flex justify="space-between" align="center">
          <ScoreCounter value={gameState.score} />
          <Box bg="rgba(25, 4, 4, 0.7)" px={4} py={2} borderRadius="lg">
            <Text color="red.300">Lives Left {Array(gameState.lives).fill('❤️').join(' ')}</Text>
          </Box>
          <GameTimer 
            isRunning={gameState.isReady && !gameState.showResults} 
            onTimeUpdate={(time) => setGameState(prev => ({ ...prev, gameTime: time }))}
          />
        </Flex>

        {/* Game Area */}
        <Box position="relative" width="100%" paddingTop="56.25%" borderRadius="xl" overflow="hidden">
          <MotionImage
            key={gameState.imageKey}
            src={gameState.currentImage}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Skip button */}
          <Box
            position="absolute"
            bottom={4}
            right={4}
            zIndex={1}
          >
            <Button
              leftIcon={<Icon as={FaForward} />}
              onClick={handleSkip}
              variant="solid"
              colorScheme="blue"
              size="sm"
              opacity={0.6}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s"
            >
              Skip
            </Button>
          </Box>

          {/* Multiple Choice Options Container */}
          {isMultipleChoice && (
            <MotionButtonContainer
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="rgba(0, 0, 0, 0.5)"
              backdropFilter="blur(8px)"
              p={4}
              variants={buttonContainerVariants}
              initial="initial"
              whileHover="hover"
              animate="initial"
            >
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {gameState.options.map((option, index) => (
                  <MotionButton
                    key={option.id}
                    onClick={() => handleGuess(option.name)}
                    isDisabled={gameState.inputDisabled}
                    colorScheme="blue"
                    size="lg"
                    variant="outline"
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.name}
                  </MotionButton>
                ))}
              </Grid>
            </MotionButtonContainer>
          )}
        </Box>

        {/* Manual Input Mode */}
        {!isMultipleChoice && (
          <Box position="relative" mt={4}>
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !gameState.inputDisabled) {
                  handleGuess(input)
                  setSuggestions([])
                }
              }}
              placeholder="Type zone name..."
              size="lg"
              bg="rgba(13, 16, 33, 0.7)"
              color="white"
              border="2px solid"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              isDisabled={gameState.inputDisabled}
              transition="all 0.2s ease"
              spellCheck="false"
              autoComplete="off"
            />

            {/* Suggestions Box */}
            <AnimatePresence>
              {suggestions.length > 0 && !gameState.inputDisabled && (
                <MotionBox
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  mt={2}
                  bg="rgba(13, 16, 33, 0.95)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blue.500"
                  zIndex={10}
                  maxH="200px"
                  overflowY="auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    'msOverflowStyle': 'none',
                    'scrollbarWidth': 'none',
                    'backdropFilter': 'blur(12px)'
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <MotionBox
                      key={index}
                      px={4}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.03,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Text color="white" fontSize="md">
                        {suggestion}
                      </Text>
                    </MotionBox>
                  ))}
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        )}
      </VStack>

      {/* Notifications and Modals */}
      <GameNotification
        message={notificationText}
        type={notificationType}
        isVisible={showNotification}
      />
      
      <ReadyModal
        isOpen={!gameState.isReady}
        onClose={() => navigate('/play')}
        onStart={handleGameStart}
      />

      <ResultsModal
        isOpen={gameState.showResults}
        onClose={() => navigate('/play')}
        score={gameState.score}
        questionsAnswered={gameState.questionsAnswered}
        timeElapsed={gameState.gameTime}
        mode={isMultipleChoice ? 'easy' : 'hard'}
        skippedQuestions={gameState.skippedZones.size}
      />

      <ZoomWarning isPlaying={true} />
    </Container>
  )
}

export default Game 