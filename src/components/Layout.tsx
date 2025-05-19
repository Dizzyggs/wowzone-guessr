import { Box, Container, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import overlayImage from '../assets/overlay.jpg'
import './Layout.scss'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      height={"100vh"}
      overflowY={"hidden"}
      position="relative"
      className='Layout-Container'
      bg="#0A0F1C" // Dark base color
      _before={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${overlayImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <Box position="relative" zIndex={1}>
        <Navbar />
        <Container maxW="container.xl" py={8}>
          <Flex direction="column" gap={8}>
            {children || <Outlet />}
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout 