import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import GameModeSelect from './pages/GameModeSelect'
import { ChakraProvider } from '@chakra-ui/react'
import ErrorBoundary from './components/ErrorBoundary'
import theme from './theme'
import FeedbackPage from './pages/FeedbackPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Changelog from './pages/Changelog'

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
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/changelog" element={<Changelog />} />
            {/* Add more routes as needed */}
          </Route>
          {/* Admin routes without Layout */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default App
