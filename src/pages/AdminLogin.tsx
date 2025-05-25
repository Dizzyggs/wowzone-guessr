import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
  Heading
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsLoading(true)
    
    // Simple authentication
    if (username === 'freddan11' && password === 'freddan11ok') {
      // Set a session flag
      sessionStorage.setItem('isAdminAuthenticated', 'true')
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard')
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8}>
        <VStack spacing={3}>
          <Icon as={FaLock} w={10} h={10} color="blue.400" />
          <Heading size="xl">Admin Login</Heading>
        </VStack>

        <Box
          w="full"
          maxW="400px"
          p={8}
          borderRadius="xl"
          bg="rgba(10, 15, 28, 0.95)"
          border="2px solid"
          borderColor="blue.400"
          boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="lg"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              onKeyPress={handleKeyPress}
            />

            <InputGroup size="lg">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{ borderColor: "blue.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                onKeyPress={handleKeyPress}
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  _hover={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                  size="sm"
                >
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    color="whiteAlpha.600"
                  />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              onClick={handleLogin}
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default AdminLogin 