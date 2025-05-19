import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import GameModeSelect from './pages/GameModeSelect'
import { ChakraProvider } from '@chakra-ui/react'
import ErrorBoundary from './components/ErrorBoundary'
// import { Router } from 'react-router-dom'
import theme from './theme'

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<GameModeSelect />} />
            <Route path="/play/:mode" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* Add more routes as needed */}
          </Route>
        </Routes>
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default App
