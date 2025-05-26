import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Box,
  UnorderedList,
  ListItem,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaHeart, FaClock, FaTrophy, FaKeyboard, FaMousePointer } from 'react-icons/fa';

interface HowToPlayGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayGuide = ({ isOpen, onClose }: HowToPlayGuideProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader fontSize="2xl" textAlign="center">How to Play ZoneGuessr</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Game Modes */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="purple.300">
                Game Modes
              </Text>
              <Box bg="gray.700" p={4} borderRadius="md">
                <Flex gap={4} mb={4}>
                  <Box flex={1}>
                    <Text fontWeight="bold" color="green.300">
                      <Flex as="span" align="center">
                        <FaMousePointer />
                        <Box ml={2}>Multiple Choice Mode</Box>
                      </Flex>
                    </Text>
                    <Text fontSize="sm">
                      Choose from 4 options. Perfect for beginners or casual play.
                    </Text>
                    <Text fontSize="sm" mt={2} color="gray.400">
                      • 1 life
                      • 100 points per correct answer
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="bold" color="blue.300">
                      <Flex as="span" align="center">
                        <FaKeyboard />
                        <Box ml={2}>Input Mode</Box>
                      </Flex>
                    </Text>
                    <Text fontSize="sm">
                      Type the zone name. For true WoW geography experts!
                    </Text>
                    <Text fontSize="sm" mt={2} color="gray.400">
                      • 2 lives
                      • 200 points per correct answer
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* Game Features */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="purple.300">
                Game Features
              </Text>
              <UnorderedList spacing={3} styleType="none" ml={0}>
                <ListItem>
                  <Flex align="center" bg="gray.700" p={3} borderRadius="md">
                    <Box as={FaHeart} color="red.400" boxSize={5} mr={3} />
                    <Box>
                      <Text fontWeight="bold">Lives System</Text>
                      <Text fontSize="sm">✍️<strong style={{textDecoration: 'underline'}}>Input mode:</strong> Start with 2 lives. Each wrong answer costs 1 life.</Text>
                      <Text fontSize="sm">❓<strong style={{textDecoration: 'underline'}}>Multiple choice mode:</strong> 1 life only per question.</Text>
                    </Box>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex align="center" bg="gray.700" p={3} borderRadius="md">
                    <Box as={FaClock} color="yellow.400" boxSize={5} mr={3} />
                    <Box>
                      <Text fontWeight="bold">Time Bonus</Text>
                      <Text fontSize="sm">Finish faster to earn bonus points! Up to 300 extra points for completing under 1 minute.</Text>
                    </Box>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex align="center" bg="gray.700" p={3} borderRadius="md">
                    <Box as={FaTrophy} color="yellow.500" boxSize={5} mr={3} />
                    <Box>
                      <Text fontWeight="bold">Scoring System</Text>
                      <Text fontSize="sm">• ✍️<strong style={{textDecoration: 'underline'}}>Input Mode:</strong> 200 points per correct answer</Text>
                      <Text fontSize="sm">• ❓<strong style={{textDecoration: 'underline'}}>Multiple Choice Mode:</strong> 100 points per correct answer</Text>
                      <Text fontSize="sm">• Time bonus based on completion speed</Text>
                      <Text fontSize="sm">• Compete for high scores on the leaderboard!</Text>
                    </Box>
                  </Flex>
                </ListItem>
              </UnorderedList>
            </Box>

            {/* Available Zones */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="purple.300">
                Available Zones
              </Text>
              <Flex gap={2} flexWrap="wrap">
                <Badge colorScheme="blue">WoW Vanilla</Badge>
                <Badge colorScheme="orange">WoW TBC</Badge>
              </Flex>
              <Text fontSize="sm" mt={2}>
                Test your knowledge across both Classic and TBC zones!
              </Text>
            </Box>

            {/* Tips */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="purple.300">
                Pro Tips
              </Text>
              <UnorderedList spacing={2}>
                <ListItem>Look for distinctive landmarks and architecture</ListItem>
                <ListItem>Pay attention to the zone's environment and color palette</ListItem>
                <ListItem>In input mode, type and see zones matching your search!</ListItem>
                <ListItem>Try to memorize unique features of each zone</ListItem>
              </UnorderedList>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 