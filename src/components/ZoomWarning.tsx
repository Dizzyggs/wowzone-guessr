import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Text,
  VStack,
  useDisclosure,
  Collapse
} from '@chakra-ui/react'
import { useZoomLevel } from '../hooks/useZoomLevel'
import { useState, useEffect } from 'react'

interface ZoomWarningProps {
  isPlaying?: boolean
}

const ZoomWarning = ({ isPlaying = false }: ZoomWarningProps) => {
  const zoomLevel = useZoomLevel()
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [isDismissed, setIsDismissed] = useState(false)

  // Reset dismissed state when zoom changes
  useEffect(() => {
    if (zoomLevel !== 1) {
      setIsDismissed(false)
    }
  }, [zoomLevel])

  if (zoomLevel === 1 || isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onClose()
  }

  return (
    <Collapse in={isOpen} animateOpacity>
      <Alert
        status="warning"
        variant="solid"
        bg="rgba(236, 201, 75, 0.2)"
        borderColor="yellow.400"
        borderWidth={2}
        borderRadius="md"
        mb={4}
      >
        <AlertIcon />
        <Box flex="1">
          <AlertTitle color="yellow.400" mb={2}>
            Browser Zoom Detected
          </AlertTitle>
          <VStack align="start" spacing={2}>
            <AlertDescription color="white">
              {isPlaying ? (
                <Text>
                  Your browser zoom level ({Math.round(zoomLevel * 100)}%) might affect gameplay.
                  For the best experience, please use CTRL + 0 to reset zoom to 100%.
                </Text>
              ) : (
                <Text>
                  Your browser is currently zoomed to {Math.round(zoomLevel * 100)}%.
                  This might affect the game experience when you start playing.
                </Text>
              )}
            </AlertDescription>
            <Button
              size="sm"
              variant="outline"
              colorScheme="yellow"
              onClick={handleDismiss}
            >
              I understand, don't show again
            </Button>
          </VStack>
        </Box>
      </Alert>
    </Collapse>
  )
}

export default ZoomWarning 