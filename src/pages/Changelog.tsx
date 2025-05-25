import { useEffect, useState } from 'react'
import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
  Divider,
  Badge,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { FaClock } from 'react-icons/fa'
import { getChangelogs } from '../firebaseFunctions'

interface Changelog {
  id: string
  title: string
  description: string
  date: Date
  type: 'feature' | 'bugfix' | 'improvement'
}

const Changelog = () => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChangelogs = async () => {
      const data = await getChangelogs()
      setChangelogs(data)
      setIsLoading(false)
    }

    loadChangelogs()
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'green'
      case 'bugfix': return 'red'
      case 'improvement': return 'blue'
      default: return 'gray'
    }
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" textAlign="center">Changelog</Heading>

        {isLoading ? (
          <Text textAlign="center" color="gray.400">Loading updates...</Text>
        ) : changelogs.length === 0 ? (
          <Text textAlign="center" color="gray.400">No updates yet.</Text>
        ) : (
          changelogs.map((log, index) => (
            <Box
              key={log.id}
              bg="rgba(10, 15, 28, 0.95)"
              p={6}
              borderRadius="xl"
              border="2px solid"
              borderColor="blue.400"
              boxShadow="0 4px 12px rgba(66, 153, 225, 0.2)"
            >
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Heading size="md">{log.title}</Heading>
                  <Flex align="center" gap={2}>
                    <Badge colorScheme={getTypeColor(log.type)} px={2} py={1}>
                      {log.type}
                    </Badge>
                    <Flex align="center" color="gray.400" fontSize="sm">
                      <Icon as={FaClock} mr={2} />
                      {log.date.toLocaleDateString()}
                    </Flex>
                  </Flex>
                </Flex>
                <Text whiteSpace="pre-wrap">{log.description}</Text>
              </VStack>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  )
}

export default Changelog 