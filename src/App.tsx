import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import GameModeSelect from './pages/GameModeSelect'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<GameModeSelect />} />
        <Route path="/play/:mode" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Add more routes as needed */}
      </Route>
    </Routes>
  )
}

export default App
