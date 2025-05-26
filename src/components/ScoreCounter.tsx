import { useEffect, useRef } from 'react'
import { Text } from '@chakra-ui/react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface ScoreCounterProps {
  value: number
}

const MotionText = motion(Text)

const ScoreCounter = ({ value }: ScoreCounterProps) => {
  const springConfig = { damping: 15, stiffness: 300 }
  const spring = useSpring(value || 0, springConfig)
  const prevValue = useRef(value || 0)

  useEffect(() => {
    if (typeof value === 'number') {
      spring.set(value)
      prevValue.current = value
    }
  }, [value, spring])

  const displayValue = useTransform(spring, (latest) => Math.round(latest || 0))
  const isIncreasing = value > prevValue.current
  const isDecreasing = value < prevValue.current

  return (
    <MotionText
      fontSize="2xl"
      fontWeight="bold"
      initial={{ scale: 1, textShadow: "none" }}
      animate={{
        scale: value !== prevValue.current ? [1, 1.2, 1] : 1,
        textShadow: isIncreasing 
          ? ["none", "0 0 10px rgba(255, 215, 0, 0.7)", "none"]
          : isDecreasing 
            ? ["none", "0 0 10px rgba(255, 0, 0, 0.7)", "none"]
            : "none",
        color: isIncreasing 
          ? ["white", "yellow.300", "white"]
          : isDecreasing 
            ? ["white", "red.300", "white"]
            : "white"
      }}
      transition={{ 
        duration: 0.4,
        times: [0, 0.5, 1]
      }}
    >
      Score: <motion.span>{displayValue}</motion.span>
    </MotionText>
  )
}

export default ScoreCounter 