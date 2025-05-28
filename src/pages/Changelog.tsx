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
  Center,
  IconButton,
  useToast
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { getChangelogs, updateChangelogLikes } from '../firebaseFunctions'
import ChangelogDetailModal from '../components/ChangelogDetailModal'
import { FaThumbsUp } from 'react-icons/fa'

const MotionBox = motion(Box)

interface Changelog {
  id?: string
  title: string
  type: 'feature' | 'bugfix' | 'improvement'
  added?: string
  changed?: string
  removed?: string
  date: Date
  likes?: number
}

const Changelog = () => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [selectedChangelog, setSelectedChangelog] = useState<Changelog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Get liked changelogs from localStorage
  const getLikedChangelogs = (): Set<string> => {
    const liked = localStorage.getItem('likedChangelogs')
    return liked ? new Set<string>(JSON.parse(liked)) : new Set<string>()
  }

  const [likedChangelogs, setLikedChangelogs] = useState<Set<string>>(getLikedChangelogs())

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

  const handleLike = async (e: React.MouseEvent, changelogId: string) => {
    e.stopPropagation() // Prevent opening the modal when clicking the like button
    
    if (!changelogId) return

    try {
      const isLiked = likedChangelogs.has(changelogId)
      const newLikedChangelogs = new Set(likedChangelogs)
      
      if (isLiked) {
        newLikedChangelogs.delete(changelogId)
      } else {
        newLikedChangelogs.add(changelogId)
      }

      // Update localStorage
      localStorage.setItem('likedChangelogs', JSON.stringify([...newLikedChangelogs]))
      setLikedChangelogs(newLikedChangelogs)

      // Update Firestore
      await updateChangelogLikes(changelogId, !isLiked)

      // Update local state
      setChangelogs(prev => prev.map(log => {
        if (log.id === changelogId) {
          return {
            ...log,
            likes: (log.likes || 0) + (isLiked ? -1 : 1)
          }
        }
        return log
      }))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
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
              <Flex 
                justify="space-between" 
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={{ base: 3, md: 0 }}
              >
                <Heading size="md" color="white">
                  {changelog.title}
                </Heading>
                <Flex 
                  align="center" 
                  gap={4}
                  flexWrap="wrap"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <Flex align="center" gap={2}>
                    <IconButton
                      aria-label="Like changelog"
                      icon={<FaThumbsUp />}
                      size="sm"
                      colorScheme={likedChangelogs.has(changelog.id!) ? 'blue' : 'gray'}
                      variant={likedChangelogs.has(changelog.id!) ? 'solid' : 'outline'}
                      onClick={(e) => handleLike(e, changelog.id!)}
                      _hover={{
                        transform: 'scale(1.1)',
                      }}
                      transition="all 0.2s"
                    />
                    <Text color="gray.400">
                      {changelog.likes || 0}
                    </Text>
                  </Flex>
                  <Badge colorScheme={getTypeColor(changelog.type)} fontSize="0.8em">
                    {changelog.type.toUpperCase()}
                  </Badge>
                  <Text color="gray.400">
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