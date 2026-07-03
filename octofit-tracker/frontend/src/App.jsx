import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

function Home() {
  return (
    <section className="container py-4">
      <h1 className="h3 mb-2">OctoFit Tracker</h1>
      <p className="text-secondary mb-0">
        Use the navigation to view users, teams, workouts, activities, and leaderboard data.
      </p>
    </section>
  )
}

function App() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <nav className="nav nav-pills gap-2">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/users" className="nav-link">
            Users
          </NavLink>
          <NavLink to="/teams" className="nav-link">
            Teams
          </NavLink>
          <NavLink to="/workouts" className="nav-link">
            Workouts
          </NavLink>
          <NavLink to="/activities" className="nav-link">
            Activities
          </NavLink>
          <NavLink to="/leaderboard" className="nav-link">
            Leaderboard
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  )
}

export default App
