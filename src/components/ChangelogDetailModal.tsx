import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Box,
  Text,
  Badge,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

interface ChangelogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  changelog: {
    title: string
    type: 'feature' | 'bugfix' | 'improvement'
    added?: string
    changed?: string
    removed?: string
    date: Date
  }
}

const ChangelogDetailModal = ({ isOpen, onClose, changelog }: ChangelogDetailModalProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'green'
      case 'bugfix': return 'red'
      case 'improvement': return 'blue'
      default: return 'gray'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent
        bg="rgba(10, 15, 28, 0.95)"
        border="2px solid"
        borderColor="blue.400"
        boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
        mx={4}
      >
        <ModalHeader 
          color="white" 
          borderBottom="1px solid" 
          borderColor="whiteAlpha.200"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text>{changelog.title}</Text>
          <Badge colorScheme={getTypeColor(changelog.type)} fontSize="0.8em">
            {changelog.type.toUpperCase()}
          </Badge>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {changelog.added && (
              <Box>
                <Text color="green.400" fontWeight="bold" mb={2}>Added</Text>
                <Box 
                  bg="whiteAlpha.100" 
                  p={4} 
                  borderRadius="md"
                  color="white"
                  sx={{
                    '& ul': { paddingLeft: '20px' },
                    '& li': { margin: '4px 0' }
                  }}
                >
                  <ReactMarkdown>{changelog.added}</ReactMarkdown>
                </Box>
              </Box>
            )}

            {changelog.changed && (
              <Box>
                <Text color="blue.400" fontWeight="bold" mb={2}>Changed/Fixed</Text>
                <Box 
                  bg="whiteAlpha.100" 
                  p={4} 
                  borderRadius="md"
                  color="white"
                  sx={{
                    '& ul': { paddingLeft: '20px' },
                    '& li': { margin: '4px 0' }
                  }}
                >
                  <ReactMarkdown>{changelog.changed}</ReactMarkdown>
                </Box>
              </Box>
            )}

            {changelog.removed && (
              <Box>
                <Text color="red.400" fontWeight="bold" mb={2}>Removed</Text>
                <Box 
                  bg="whiteAlpha.100" 
                  p={4} 
                  borderRadius="md"
                  color="white"
                  sx={{
                    '& ul': { paddingLeft: '20px' },
                    '& li': { margin: '4px 0' }
                  }}
                >
                  <ReactMarkdown>{changelog.removed}</ReactMarkdown>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.200">
          <Button
            onClick={onClose}
            colorScheme="blue"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ChangelogDetailModal 