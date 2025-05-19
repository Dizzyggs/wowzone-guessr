import { useEffect, useState } from 'react'
import { Box, Text, HStack, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaClock } from 'react-icons/fa'

const MotionBox = motion(Box)

interface GameTimerProps {
  isRunning: boolean
  onTimeUpdate?: (time: number) => void
}

const GameTimer = ({ isRunning, onTimeUpdate }: GameTimerProps) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1
          onTimeUpdate?.(newTime)
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      bg="rgba(10, 15, 28, 0.95)"
      borderRadius="lg"
      px={4}
      py={2}
      border="2px solid"
      borderColor="blue.400"
      boxShadow="0 0 10px rgba(66, 153, 225, 0.3)"
    >
      <HStack spacing={2} align="center">
        <Icon 
          as={FaClock} 
          color="blue.400"
          w={4}
          h={4}
          animation={isRunning ? "pulse 2s infinite" : "none"}
        />
        <Text
          fontSize="xl"
          fontFamily="mono"
          fontWeight="bold"
          color="white"
          letterSpacing="wider"
        >
          {formatTime(time)}
        </Text>
      </HStack>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </MotionBox>
  )
}

export default GameTimer 