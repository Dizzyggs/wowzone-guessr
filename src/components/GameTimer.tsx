import { useEffect, useState } from 'react'
import { Box, Text, Icon } from '@chakra-ui/react'
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
      bg="rgba(13, 16, 33, 0.7)"
      borderRadius="lg"
      px={3}
      py={1}
      border="1px solid"
      borderColor="blue.400"
      boxShadow="0 0 10px rgba(66, 153, 225, 0.15)"
      display="flex"
      alignItems="center"
      gap={2}
    >
      <Icon 
        as={FaClock} 
        color="blue.400"
        w={3}
        h={3}
        opacity={isRunning ? 1 : 0.7}
      />
      <Text
        fontSize="md"
        fontFamily="mono"
        fontWeight="bold"
        color="white"
        letterSpacing="wider"
        opacity={0.9}
      >
        {formatTime(time)}
      </Text>
    </MotionBox>
  )
}

export default GameTimer 