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
  useBreakpointValue
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { getZonesByContinent, getZoneNames, type Zone } from '../data/zones'
import { preloadImages, getZoneImagePath } from '../utils/imagePreloader'
import { extractDominantColor } from '../utils/colorExtractor'
import GameNotification from '../components/GameNotification'
import ScoreCounter from '../components/ScoreCounter'
import GameTimer from '../components/GameTimer'
import ResultsModal from '../components/ResultsModal'
import ReadyModal from '../components/ReadyModal'
import ZoomWarning from '../components/ZoomWarning'
import AmbientParticles from '../components/AmbientParticles'
import { FaForward } from 'react-icons/fa'
import './Game.scss'

// const MotionBox = motion(Box)
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

const glassBoxStyle = {
  background: 'rgba(13, 16, 33, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
}

const glassButtonStyle = {
  bg: 'rgba(13, 16, 33, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  color: 'white',
  transition: 'all 0.2s ease-in-out',
  _hover: {
    bg: 'rgba(13, 16, 33, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transform: 'translateY(-2px)',
    color: 'blue.200',
  },
  _active: {
    bg: 'rgba(13, 16, 33, 0.9)',
    transform: 'translateY(1px)',
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
  },
}

const glassInputStyle = {
  bg: 'rgba(13, 16, 33, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  color: 'white',
  _placeholder: { color: 'whiteAlpha.500' },
  _hover: {
    border: '1px solid rgba(255, 255, 255, 0.2)',
    bg: 'rgba(13, 16, 33, 0.8)',
  },
  _focus: {
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3)',
    bg: 'rgba(13, 16, 33, 0.9)',
  },
}

const Game = () => {
  const { mode } = useParams()
  const navigate = useNavigate()
  
  // Multiple choice mode is when mode is 'easy'
  const isMultipleChoice = mode === 'easy'
  
  // Add mobile detection
  const isMobile = useBreakpointValue({ base: true, md: false })
  
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

  const [isSkipping, setIsSkipping] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success')
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [dominantColor, setDominantColor] = useState('#3182ce')

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

    // Extract dominant color when loading new image
    extractDominantColor(imagePath).then(color => {
      setDominantColor(color)
    })

    // Preload the next image before updating state
    const img = document.createElement('img')
    img.src = imagePath
    img.onload = () => {
      setGameState(prev => ({
        ...prev,
        currentZone: randomZone,
        currentImage: imagePath,
        options,
        usedZones: new Set([...prev.usedZones, randomZone.id]),
        imageKey: prev.imageKey + 1,
        lives: isMultipleChoice ? 1 : 2
      }))
    }

    // Preload next batch of images in background
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

  const handleSkip = async () => {
    if (!gameState.currentZone || isSkipping) return;
    
    setIsSkipping(true);
    
    // Show notification
    showGameNotification('Question skipped', 'info');

    // Update skipped zones
    setGameState(prev => ({
      ...prev,
      skippedZones: new Set([...prev.skippedZones, prev.currentZone!.name]),
      questionsAnswered: prev.questionsAnswered + 1
    }));

    // Get next zone with loading state
    const unusedZones = availableZones.filter(zone => !gameState.usedZones.has(zone.id));

    if (unusedZones.length === 0) {
      setGameState(prev => ({ 
        ...prev, 
        showResults: true,
        isAnswering: true
      }));
      setIsSkipping(false);
      return;
    }

    const randomZone = unusedZones[Math.floor(Math.random() * unusedZones.length)];
    const options = isMultipleChoice ? getRandomOptions(randomZone) : [];
    const imagePath = getZoneImagePath(randomZone);

    // Extract dominant color for the new image
    try {
      const newColor = await extractDominantColor(imagePath);
      setDominantColor(newColor);
    } catch (error) {
      console.error('Failed to extract dominant color:', error);
    }

    // Create and load the new image
    const img = document.createElement('img');
    img.src = imagePath;
    
    img.onload = () => {
      setGameState(prev => ({
        ...prev,
        currentZone: randomZone,
        currentImage: imagePath,
        options,
        usedZones: new Set([...prev.usedZones, randomZone.id]),
        imageKey: prev.imageKey + 1,
        lives: isMultipleChoice ? 1 : 2
      }));
      setTimeout(() => {
        setIsSkipping(false);
      }, 1500);
    };

    img.onerror = () => {
      console.error('Failed to load next image');
      setIsSkipping(false);
    };

    // Preload next batch of images in background
    const remainingZones = unusedZones.filter(zone => zone.id !== randomZone.id);
    preloadImages(remainingZones);
  };

  return (
    <Container maxW="container.xl" py={4} position="relative" px={{ base: 2, md: 4 }}>
      {/* Add AmbientParticles before other content */}
      <AmbientParticles color={dominantColor} />
      
      <VStack spacing={4} align="stretch">
        {/* Score and Lives */}
        <Flex justify="space-between" align="center" fontSize={{ base: "sm", md: "md" }}>
          <ScoreCounter value={gameState.score} />
          <Box 
            px={3} 
            py={1} 
            borderRadius="lg"
            sx={glassBoxStyle}
          >
            <Text color="red.300">Lives Left {Array(gameState.lives).fill('❤️').join(' ')}</Text>
          </Box>
          <Flex gap={2} align="center">
            <Box 
              px={2} 
              py={1} 
              borderRadius="lg"
              sx={glassBoxStyle}
            >
              <Text color="blue.300" fontSize="sm">{gameState.questionsAnswered}/{availableZones.length}</Text>
            </Box>
            <GameTimer 
              isRunning={gameState.isReady && !gameState.showResults} 
              onTimeUpdate={(time) => setGameState(prev => ({ ...prev, gameTime: time }))}
            />
          </Flex>
        </Flex>

        {/* Game Area with Extended Ambient Background */}
        <Box
          position="relative"
          width="100%"
          height={{ base: "50vh", md: "auto" }}
          paddingTop={{ base: "0", md: "56.25%" }}
        >
          {/* Ambient Background Container */}
          <Box
            position="fixed"
            left="0"
            right="0"
            top="0"
            bottom="0"
            zIndex={0}
            pointerEvents="none"
            opacity={0.4}
            style={{
              backgroundImage: `url(${gameState.currentImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(140px) brightness(0.3)',
              transition: 'all 0.5s ease-in-out',
            }}
          />

          {/* Main Game Content */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="xl"
            overflow="hidden"
            zIndex={1}
          >
            <AnimatePresence mode="wait">
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
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
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
                size="sm"
                sx={glassButtonStyle}
                isDisabled={isSkipping}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  _hover: {
                    transform: 'none',
                  }
                }}
              >
                {isSkipping ? 'Skipping...' : 'Skip'}
              </Button>
            </Box>

            {/* Multiple Choice Options Container - Desktop Only */}
            {isMultipleChoice && !isMobile && (
              <MotionButtonContainer
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={4}
                variants={buttonContainerVariants}
                initial="initial"
                whileHover="hover"
                sx={glassBoxStyle}
              >
                <Grid 
                  templateColumns="repeat(2, 1fr)"
                  gap={4}
                  width="100%"
                >
                  {gameState.options.map((option, index) => (
                    <MotionButton
                      key={option.id ? option.id : index}
                      onClick={() => handleGuess(option.name)}
                      isDisabled={gameState.inputDisabled}
                      size="md"
                      py={3}
                      px={4}
                      width="100%"
                      height="auto"
                      fontSize="md"
                      sx={glassButtonStyle}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 }
                      }}
                    >
                      {option.name}
                    </MotionButton>
                  ))}
                </Grid>
              </MotionButtonContainer>
            )}
          </Box>
        </Box>

        {/* Multiple Choice Options Container - Mobile Only */}
        {isMultipleChoice && isMobile && (
          <Box 
            mt={4}
            px={4}
            pb="calc(env(safe-area-inset-bottom) + 12px)"
            sx={{
              ...glassBoxStyle,
              background: 'rgba(13, 16, 33, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 'xl',
            }}
          >
            <Grid 
              templateColumns="1fr"
              gap={2}
              width="100%"
            >
              {gameState.options.map((option, index) => (
                <MotionButton
                  key={option.id ? option.id : index}
                  onClick={() => handleGuess(option.name)}
                  isDisabled={gameState.inputDisabled}
                  size="md"
                  py={2}
                  fontSize="md"
                  sx={glassButtonStyle}
                >
                  {option.name}
                </MotionButton>
              ))}
            </Grid>
          </Box>
        )}

        {/* Manual Input Mode */}
        {!isMultipleChoice && (
          <MotionButtonContainer
            mt={4}
            px={4}
            pb="calc(env(safe-area-inset-bottom) + 12px)"
            sx={{
              borderRadius: 'xl',
            }}
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Enter zone name..."
              size="lg"
              sx={glassInputStyle}
            />
            {suggestions.length > 0 && (
              <Box
                mt={2}
                sx={{
                  ...glassBoxStyle,
                  background: 'rgba(13, 16, 33, 0.95)',
                  backdropFilter: 'blur(20px)',
                }}
                borderRadius="md"
                overflow="hidden"
              >
                <AnimatePresence>
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, delay: index * 0.05 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Box
                        px={4}
                        py={2}
                        cursor="pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Text color="white">{suggestion}</Text>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </MotionButtonContainer>
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