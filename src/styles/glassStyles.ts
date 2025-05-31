import type { SystemStyleObject } from '@chakra-ui/react'

export const glassEffect: SystemStyleObject = {
  background: 'rgba(13, 16, 33, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
}

export const buttonGlassEffect: SystemStyleObject = {
  ...glassEffect,
  color: 'white',
  transition: 'all 0.2s ease-in-out',
  _hover: {
    background: 'rgba(13, 16, 33, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transform: 'translateY(-2px)',
    color: 'blue.200',
  },
  _active: {
    background: 'rgba(13, 16, 33, 0.9)',
    transform: 'translateY(1px)',
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
  },
}

export const inputGlassEffect: SystemStyleObject = {
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  _placeholder: { color: 'whiteAlpha.500' },
  _hover: {
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  _focus: {
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3)',
  },
} 