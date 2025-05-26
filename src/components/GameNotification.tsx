import { motion, AnimatePresence } from 'framer-motion'
import { Box, HStack, Text } from '@chakra-ui/react'

interface GameNotificationProps {
  message: string
  points?: number
  isVisible: boolean
  type: 'success' | 'error' | 'info'
  containerStyle?: React.CSSProperties
}

const GameNotification: React.FC<GameNotificationProps> = ({ message, points, isVisible, type = 'success', containerStyle }) => {
  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'rgba(25, 4, 4, 0.95)',
          text: '#FF4444',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          shadow: '0 0 10px rgba(255, 68, 68, 0.15)'
        }
      case 'info':
        return {
          bg: 'rgba(0, 0, 255, 0.95)',
          text: '#00FF66',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          shadow: '0 0 15px rgba(0, 255, 102, 0.2)'
        }
      default:
        return {
          bg: 'rgba(0, 15, 5, 0.95)',
          text: '#00FF66',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          shadow: '0 0 15px rgba(0, 255, 102, 0.2)'
        }
    }
  }

  const colors = getColors()

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          position="fixed"
          top="55rem"
          left="50%"
          zIndex={2000}
          style={{ transform: 'translateX(-50%)', ...containerStyle }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <HStack spacing={2}>
              <Box
                bg={colors.bg}
                px={4}
                py={1.5}
                borderRadius="full"
                border={colors.border}
                boxShadow={colors.shadow}
                style={{
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Text 
                  color={colors.text}
                  fontSize="md"
                  fontWeight="semibold"
                  letterSpacing="0.3px"
                >
                  {message}
                </Text>
              </Box>
              
              {points && (
                <Box
                  bg={colors.bg}
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  border={colors.border}
                  boxShadow={colors.shadow}
                  style={{
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Text 
                    color="#00FF66"
                    fontSize="md"
                    fontWeight="bold"
                    letterSpacing="0.3px"
                  >
                    +{points} points
                  </Text>
                </Box>
              )}
            </HStack>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default GameNotification 