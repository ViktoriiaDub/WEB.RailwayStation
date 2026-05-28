import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [selectedWagon, setSelectedWagon] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('railwayBookings') || '[]')
    } catch {
      return []
    }
  })

  function selectTrain(train) {
    setSelectedTrain(train)
    setSelectedWagon(null)
    setSelectedSeats([])
  }

  function selectWagon(wagon) {
    setSelectedWagon(wagon)
    setSelectedSeats([])
  }

  function toggleSeat(seatNumber) {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    )
  }

  function saveBooking(formData) {
    const newBooking = {
      id: Date.now(),
      trainId: selectedTrain.id,
      trainNumber: selectedTrain.number,
      from: selectedTrain.from,
      to: selectedTrain.to,
      departure: selectedTrain.departure,
      wagonNumber: selectedWagon.number,
      wagonType: selectedWagon.type,
      seats: [...selectedSeats],
      ...formData,
      createdAt: new Date().toISOString(),
    }
    const updated = [...bookings, newBooking]
    setBookings(updated)
    localStorage.setItem('railwayBookings', JSON.stringify(updated))
    return newBooking
  }

  function resetBooking() {
    setSelectedWagon(null)
    setSelectedSeats([])
  }

  // Get all booked seats for a specific wagon across all existing bookings
  function getBookedSeatsForWagon(trainId, wagonNumber) {
    const fromStorage = bookings
      .filter((b) => b.trainId === trainId && b.wagonNumber === wagonNumber)
      .flatMap((b) => b.seats)
    return fromStorage
  }

  return (
    <BookingContext.Provider
      value={{
        selectedTrain,
        selectedWagon,
        selectedSeats,
        bookings,
        selectTrain,
        selectWagon,
        toggleSeat,
        saveBooking,
        resetBooking,
        getBookedSeatsForWagon,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
