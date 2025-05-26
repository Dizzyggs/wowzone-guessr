import { motion, AnimatePresence } from 'framer-motion'
import { Box, HStack, Text, Icon } from '@chakra-ui/react'
import { FaForward } from 'react-icons/fa'

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
          bg: 'rgba(13, 16, 33, 0.95)',
          text: '#63B3ED',
          border: '1px solid rgba(99, 179, 237, 0.3)',
          shadow: '0 0 15px rgba(99, 179, 237, 0.2)'
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
          top="20%"
          left="50%"
          zIndex={2000}
          style={{ transform: 'translate(-50%, -50%)', ...containerStyle }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <HStack spacing={2}>
              <Box
                bg={colors.bg}
                px={6}
                py={3}
                borderRadius="xl"
                border={colors.border}
                boxShadow={colors.shadow}
                style={{
                  backdropFilter: 'blur(12px)',
                }}
              >
                <HStack spacing={3} align="center">
                  {type === 'info' && (
                    <Icon 
                      as={FaForward} 
                      color={colors.text}
                      boxSize={5}
                    />
                  )}
                  <Text 
                    color={colors.text}
                    fontSize="lg"
                    fontWeight="bold"
                    letterSpacing="0.5px"
                  >
                    {message}
                  </Text>
                </HStack>
              </Box>
              
              {points && (
                <Box
                  bg={colors.bg}
                  px={6}
                  py={3}
                  borderRadius="xl"
                  border={colors.border}
                  boxShadow={colors.shadow}
                  style={{
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Text 
                    color="#00FF66"
                    fontSize="lg"
                    fontWeight="bold"
                    letterSpacing="0.5px"
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