import {Routes, Route} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<LoginForm />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobItemDetails />} />
    </Route>

    {/* Not Found */}
    <Route path="/not-found" element={<NotFound />} />

     </Routes>
)

export default App
