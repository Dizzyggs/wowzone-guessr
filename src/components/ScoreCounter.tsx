import { useEffect } from 'react'
import { Text } from '@chakra-ui/react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface ScoreCounterProps {
  value: number
}

const MotionText = motion(Text)

const ScoreCounter = ({ value }: ScoreCounterProps) => {
  const springConfig = { damping: 15, stiffness: 300 }
  const spring = useSpring(value, springConfig)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  const displayValue = useTransform(spring, (latest) => Math.round(latest))

  return (
    <MotionText
      fontSize="2xl"
      fontWeight="bold"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.3 }}
    >
      Score: <motion.span>{displayValue}</motion.span>
    </MotionText>
  )
}

export default ScoreCounter 