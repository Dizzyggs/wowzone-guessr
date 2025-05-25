import { Container } from '@chakra-ui/react'
import ZoomWarning from '../components/ZoomWarning'
import { Box } from '@chakra-ui/react'

export default function GameModeSelection() {
  return (
    <Container maxW="container.xl" py={8}>
      <ZoomWarning />
      <Box>
        {/* Your existing game mode selection content */}
      </Box>
    </Container>
  )
} 