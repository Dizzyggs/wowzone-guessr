import { useState, useEffect } from 'react'
import {
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Badge,
  Flex,
  Spinner,
  Center,
  IconButton,
  useToast,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getChangelogs, updateChangelogLikes } from '../firebaseFunctions'
import { FaThumbsUp, FaPlus, FaWrench, FaMinus } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

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
  const [isLoading, setIsLoading] = useState(true)
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

  const handleLike = async (e: React.MouseEvent, changelogId: string) => {
    e.stopPropagation()
    
    if (!changelogId) return

    try {
      const isLiked = likedChangelogs.has(changelogId)
      const newLikedChangelogs = new Set(likedChangelogs)
      
      if (isLiked) {
        newLikedChangelogs.delete(changelogId)
      } else {
        newLikedChangelogs.add(changelogId)
      }

      localStorage.setItem('likedChangelogs', JSON.stringify([...newLikedChangelogs]))
      setLikedChangelogs(newLikedChangelogs)
      await updateChangelogLikes(changelogId, !isLiked)

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
    <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }}>
      {/* Background Gradient */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial-gradient(circle at top right, rgba(66, 153, 225, 0.1), transparent 60%), radial-gradient(circle at bottom left, rgba(159, 122, 234, 0.1), transparent 60%)"
        zIndex={-1}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 8, md: 12 }} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading 
            fontSize={{ base: "4xl", md: "6xl" }}
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
            bgClip="text"
            fontWeight="extrabold"
            textAlign="center"
            letterSpacing="tight"
            mb={4}
          >
            Changelog
          </Heading>
          <Text 
            color="whiteAlpha.800" 
            fontSize={{ base: "lg", md: "xl" }}
            textAlign="center"
            maxW="2xl"
            mx="auto"
            lineHeight="tall"
          >
            Track the evolution of WoW ZoneGuessr with our latest updates and improvements
          </Text>
        </MotionBox>

        {/* Changelog List */}
        <Box position="relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Center py={20}>
                <Spinner 
                  size="xl" 
                  color="blue.400" 
                  thickness="4px"
                  speed="0.8s"
                  emptyColor="whiteAlpha.100"
                />
              </Center>
            ) : changelogs.length === 0 ? (
              <Center py={20}>
                <Text color="whiteAlpha.600" fontSize="xl">No changelog entries yet.</Text>
              </Center>
            ) : (
              <VStack spacing={6} align="stretch">
                {changelogs.map((changelog, index) => (
                  <MotionBox
                    key={changelog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    bg="rgba(13, 16, 33, 0.7)"
                    backdropFilter="blur(16px)"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    overflow="hidden"
                    position="relative"
                    role="group"
                  >
                    {/* Glow Effect */}
                    <Box
                      position="absolute"
                      top="-50%"
                      left="-50%"
                      width="200%"
                      height="200%"
                      background="radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, transparent 70%)"
                      opacity="0"
                      transition="opacity 0.3s"
                      _groupHover={{ opacity: "1" }}
                      pointerEvents="none"
                    />

                    {/* Header */}
                    <Box
                      p={6}
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.100"
                    >
                      <Flex 
                        justify="space-between" 
                        align="center"
                        gap={4}
                        wrap="wrap"
                      >
                        <Heading size="lg" color="white">
                          {changelog.title}
                        </Heading>
                        <HStack spacing={4}>
                          <Badge
                            colorScheme={getTypeColor(changelog.type)}
                            px={3}
                            py={1}
                            borderRadius="full"
                            textTransform="capitalize"
                            fontSize="sm"
                          >
                            {changelog.type}
                          </Badge>
                          <Text color="whiteAlpha.700" fontSize="sm">
                            {changelog.date.toLocaleDateString()}
                          </Text>
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
                            <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium">
                              {changelog.likes || 0}
                            </Text>
                          </Flex>
                        </HStack>
                      </Flex>
                    </Box>

                    {/* Content */}
                    <Box p={6}>
                      <VStack spacing={6} align="stretch">
                        {changelog.added && (
                          <Box>
                            <HStack spacing={2} mb={3}>
                              <Icon as={FaPlus} color="green.400" />
                              <Text color="green.400" fontWeight="bold">Added</Text>
                            </HStack>
                            <Box 
                              bg="whiteAlpha.50"
                              p={4}
                              borderRadius="xl"
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
                            <HStack spacing={2} mb={3}>
                              <Icon as={FaWrench} color="blue.400" />
                              <Text color="blue.400" fontWeight="bold">Changed/Fixed</Text>
                            </HStack>
                            <Box 
                              bg="whiteAlpha.50"
                              p={4}
                              borderRadius="xl"
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
                            <HStack spacing={2} mb={3}>
                              <Icon as={FaMinus} color="red.400" />
                              <Text color="red.400" fontWeight="bold">Removed</Text>
                            </HStack>
                            <Box 
                              bg="whiteAlpha.50"
                              p={4}
                              borderRadius="xl"
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
                    </Box>
                  </MotionBox>
                ))}
              </VStack>
            )}
          </AnimatePresence>
        </Box>
      </VStack>
    </Container>
  )
}

export default Changelog 