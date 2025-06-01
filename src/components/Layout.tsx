import { Box, Container, Flex } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import overlay1 from '/overlay.jpg'
import overlay2 from '/overlay2.jpg'
import './Layout.scss'

const MotionBox = motion(Box)

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [currentOverlay, setCurrentOverlay] = useState(1)
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === '/play'
  const isGamePage = location.pathname.includes('/game')

  useEffect(() => {
    if (!isHomePage) return

    const interval = setInterval(() => {
      setCurrentOverlay(prev => prev === 1 ? 2 : 1)
    }, 4500) // Switch every 4.5 seconds

    return () => clearInterval(interval)
  }, [isHomePage])

  return (
    <Box
      height={"100vh"}
      overflowY={"hidden"}
      position="relative"
      className='Layout-Container'
      bg="#0A0F1C" // Dark base color
    >
      <AnimatePresence initial={false} mode="sync">
        <MotionBox
          key={currentOverlay}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage={`url(${isGamePage ? overlay2 : (currentOverlay === 1 ? overlay1 : overlay2)})`}
          backgroundSize="cover"
          backgroundPosition="center"
          opacity={0.15}
          mixBlendMode="soft-light"
          pointerEvents="none"
          zIndex={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      <Box position="relative" zIndex={1}>
        <Navbar />
        {/* Top Gradient Fade */}
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          height="120px"
          pointerEvents="none"
          bgGradient="linear(to-b, #0A0F1C, transparent)"
          zIndex={1}
        />
        {/* Bottom Gradient Fade */}
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          height="120px"
          pointerEvents="none"
          bgGradient="linear(to-t, #0A0F1C, transparent)"
          zIndex={1}
        />
        <Container maxW="container.xl" py={location.pathname === '/' ? 0 : 8}>
          <Flex direction="column" gap={8}>
            {children || <Outlet />}
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout 