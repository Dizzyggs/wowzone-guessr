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
  // useBreakpointValue,
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
import './Game.scss'

const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionImage = motion(Image)
// const MotionSuggestionBox = motion(Box)

interface GameState {
  score: number
  lives: number
  currentZone: Zone | null
  currentImage: string
  usedZones: Set<string>
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
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
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

  const showGameNotification = (text: string, type: 'success' | 'error') => {
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

  return (
    <Container maxW="container.xl" h="full"           mt={"5rem"}>
      <VStack spacing={4} h="full">
        <Box
          position="relative"
          w="full"
          maxW="1200px"
          mx="auto"
        >
          {/* Score */}
          <Box
            position="absolute"
            left="0"
            top="-8"
          >
            <ScoreCounter value={gameState.score} />
          </Box>

          {/* Lives */}
          {!isMultipleChoice && (
            <Box
              position="absolute"
              left="50%"
              top="-5"
              transform="translateX(-50%)"
              bg="rgba(10, 15, 28, 0.95)"
              px={4}
              py={1}
              borderRadius="md"
              border="2px solid"
              borderColor="red.400"
              zIndex={5}
              width={"10rem"}
              display={"flex"}
              flexDir={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Lives Left
              </Text>
              <Flex justify="center" gap={2}>
                {Array.from({ length: gameState.lives }).map((_, i) => (
                  <Text key={i} fontSize="lg">❤️</Text>
                ))}
              </Flex>
            </Box>
          )}

          {/* Progress Counter and Timer */}
          <Flex
            position="absolute"
            right="0"
            top="-10"
            gap={4}
            align="center"
            zIndex={5}
          >
            <Text
              fontSize="md"
              color="green.400"
            >
              {gameState.questionsAnswered} / {availableZones.length}
            </Text>
            <GameTimer 
              isRunning={gameState.isReady && !gameState.isAnswering && !gameState.showResults} 
              onTimeUpdate={(time) => setGameState(prev => ({ ...prev, gameTime: time }))}
            />
          </Flex>

          {/* Main Image Container with Progress Bar */}
          <Box
            position="relative"
            borderRadius="xl"
            overflow="visible"
            boxShadow="2xl"
            w="full"
            sx={{
              aspectRatio: '16/9',
            }}
          >
            {/* Progress Bar */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              h="3px"
              bg="whiteAlpha.200"
              zIndex={2}
            >
              <Box
                h="full"
                bg="green.400"
                transition="width 0.3s ease"
                w={`${(gameState.questionsAnswered / availableZones.length) * 100}%`}
              />
            </Box>

            {showNotification && (
              <GameNotification
                message={notificationText}
                type={notificationType}
                isVisible={showNotification}
                containerStyle={{
                  position: 'absolute',
                  top: '50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 100
                }}
              />
            )}

            {/* Ambient light container */}
            <Box
              position="absolute"
              top="-100%"
              left="-100%"
              right="-100%"
              bottom="-100%"
              zIndex={-1}
              style={{
                background: gameState.currentImage ? `url(${gameState.currentImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(120px) brightness(0.6) saturate(120%)',
                opacity: 0.3,
                transform: 'scale(2)',
                mixBlendMode: 'soft-light',
              }}
            />

            {/* Main image */}
            <Box
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="dark-lg"
              h="full"
              bg="rgba(0, 0, 0, 0.2)"
            >
              <AnimatePresence mode="wait">
                <MotionImage
                  key={gameState.imageKey}
                  src={gameState.currentImage}
                  alt="Zone Image"
                  objectFit="contain"
                  objectPosition="center"
                  w="full"
                  h="full"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                  }}
                />
              </AnimatePresence>
            </Box>
          </Box>
        </Box>

        {isMultipleChoice ? (
          <Grid 
            templateColumns={{ 
              base: "1fr", 
              md: "repeat(2, 1fr)" 
            }}
            gap={4}
            w="full"
            maxW="900px"
            px={{ base: 2, sm: 4 }}
          >
            {gameState.options.map((option, index) => (
              <MotionButton
                key={option.id ? option.id : index}
                size="lg"
                height={{ base: "60px", sm: "70px" }}
                fontSize={{ base: "md", sm: "xl" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGuess(option.name)}
                isDisabled={gameState.inputDisabled}
                colorScheme={
                  gameState.isAnswering
                    ? gameState.correctAnswer === option.name
                      ? "green"
                      : "red"
                    : "purple"
                }
                variant={gameState.isAnswering && gameState.correctAnswer === option.name ? "solid" : "outline"}
                opacity={gameState.isAnswering && gameState.correctAnswer !== option.name ? 0.7 : 1}
              >
                {option.name}
              </MotionButton>
            ))}
          </Grid>
        ) : (
          <Box 
            position="relative" 
            w="full" 
            maxW="600px" 
            mx="auto"
            px={{ base: 4, sm: 0 }}
          >
            <MotionBox
              initial={false}
              animate={gameState.isAnswering ? {
                x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
                transition: { duration: 0.5 }
              } : {}}
            >
              <Input
                placeholder="Type the zone name..."
                size="lg"
                height={{ base: "45px", sm: "50px" }}
                fontSize={{ base: "md", sm: "lg" }}
                textAlign="center"
                bg="rgba(10, 15, 28, 0.95)"
                border="1px solid"
                borderRadius="2xl"
                borderColor={
                  gameState.isAnswering 
                    ? (gameState.lives > 1 ? "orange.400" : "red.400")
                    : "purple.500"
                }
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !gameState.inputDisabled) {
                    handleGuess(input)
                    setSuggestions([])
                  }
                }}
                isDisabled={gameState.inputDisabled}
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                sx={{
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 12px rgba(159, 122, 234, 0.15)',
                  transition: 'all 0.2s ease',
                  '&:focus': {
                    borderColor: 'purple.400',
                    boxShadow: '0 4px 16px rgba(159, 122, 234, 0.25)',
                    transform: 'translateY(-1px)',
                  },
                  '&:hover:not(:disabled)': {
                    borderColor: 'purple.400',
                    boxShadow: '0 4px 16px rgba(159, 122, 234, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                    cursor: 'not-allowed',
                    _hover: {
                      borderColor: gameState.lives > 1 ? "orange.400" : "red.400"
                    }
                  }
                }}
                spellCheck="false"
                autoComplete="off"
              />

              {/* Suggestions Box */}
              {suggestions.length > 0 && !gameState.inputDisabled && (
                <MotionBox
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  mt={2}
                  bg="rgba(10, 15, 28, 0.95)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="purple.500"
                  zIndex={10}
                  maxH={{ base: "180px", sm: "220px" }}
                  overflowY="auto"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.19, 1.0, 0.22, 1.0]
                  }}
                  sx={{
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbarWidth': 'none',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <MotionBox
                      key={index}
                      px={3}
                      py={1.5}
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      fontSize={{ base: "sm", sm: "md" }}
                      color="white"
                      initial={{ opacity: 0, scale: 0.7, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.1 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {suggestion}
                    </MotionBox>
                  ))}
                </MotionBox>
              )}
            </MotionBox>
          </Box>
        )}

        <ReadyModal
          isOpen={!gameState.isReady}
          onClose={() => navigate('/play')}
          onStart={handleGameStart}
        />

        <ResultsModal
          isOpen={gameState.showResults}
          onClose={() => navigate('/play')}
          questionsAnswered={gameState.usedZones.size}
          score={gameState.score}
          timeElapsed={gameState.gameTime}
          mode={mode as 'easy' | 'hard'}
        />
      </VStack>
    </Container>
  )
}

export default Game 