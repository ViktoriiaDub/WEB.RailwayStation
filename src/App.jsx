import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import Home from './pages/Home'
import Booking from './pages/Booking'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:trainId" element={<Booking />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  )
}

export default App
