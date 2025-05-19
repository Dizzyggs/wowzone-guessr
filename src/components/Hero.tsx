import { Box, Button, Container, Heading, Text, useDisclosure, HStack } from '@chakra-ui/react';
import { FaPlay, FaQuestionCircle } from 'react-icons/fa';
import { HowToPlayGuide } from './HowToPlayGuide';

interface HeroProps {
  onStartGame: () => void;
}

export const Hero = ({ onStartGame }: HeroProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="gray.900" color="white" py={16}>
      <Container maxW="container.lg" textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          WoW ZoneGuessr
        </Heading>
        <Text fontSize="xl" mb={8}>
          Test your World of Warcraft zone knowledge!
        </Text>
        <HStack spacing={4} justify="center">
          <Button
            colorScheme="purple"
            size="lg"
            leftIcon={<FaPlay />}
            onClick={onStartGame}
          >
            Start Game
          </Button>
          <Button
            variant="outline"
            colorScheme="purple"
            size="lg"
            leftIcon={<FaQuestionCircle />}
            onClick={onOpen}
          >
            How to Play
          </Button>
        </HStack>
      </Container>

      <HowToPlayGuide isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}; 