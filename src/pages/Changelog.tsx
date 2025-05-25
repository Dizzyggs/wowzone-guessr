import { useState, useEffect } from 'react'
import {
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Badge,
  useDisclosure,
  Flex,
  Spinner,
  Center
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { getChangelogs } from '../firebaseFunctions'
import ChangelogDetailModal from '../components/ChangelogDetailModal'

const MotionBox = motion(Box)

interface Changelog {
  id?: string
  title: string
  type: 'feature' | 'bugfix' | 'improvement'
  added?: string
  changed?: string
  removed?: string
  date: Date
}

const Changelog = () => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [selectedChangelog, setSelectedChangelog] = useState<Changelog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const loadChangelogs = async () => {
      setIsLoading(true)
      const data = await getChangelogs()
      setChangelogs(data)
      setIsLoading(false)
    }

    loadChangelogs()
  }, [])

  const handleChangelogClick = (changelog: Changelog) => {
    setSelectedChangelog(changelog)
    onOpen()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'green'
      case 'bugfix': return 'red'
      case 'improvement': return 'blue'
      default: return 'gray'
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="xl" color="white" mb={8} textAlign="center">
        Changelog
      </Heading>

      {isLoading ? (
        <Center py={20}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="white">Loading changelogs...</Text>
          </VStack>
        </Center>
      ) : changelogs.length === 0 ? (
        <Center py={20}>
          <Text color="gray.400">No changelog entries yet.</Text>
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {changelogs.map((changelog, index) => (
            <MotionBox
              key={changelog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              bg="rgba(10, 15, 28, 0.95)"
              p={6}
              borderRadius="lg"
              border="2px solid"
              borderColor="blue.400"
              cursor="pointer"
              onClick={() => handleChangelogClick(changelog)}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 32px rgba(66, 153, 225, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">
                  {changelog.title}
                </Heading>
                <Flex align="center" gap={4}>
                  <Badge colorScheme={getTypeColor(changelog.type)} fontSize="0.8em">
                    {changelog.type.toUpperCase()}
                  </Badge>
                  <Text color="gray.400" fontSize="sm">
                    {changelog.date.toLocaleDateString()}
                  </Text>
                </Flex>
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      )}

      {selectedChangelog && (
        <ChangelogDetailModal
          isOpen={isOpen}
          onClose={onClose}
          changelog={selectedChangelog}
        />
      )}
    </Container>
  )
}

export default Changelog 