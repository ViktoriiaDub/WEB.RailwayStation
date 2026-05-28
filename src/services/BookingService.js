const STORAGE_KEY = 'railwayBookings'

export const BookingService = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  },

  save(booking) {
    const all = this.getAll()
    const newBooking = { ...booking, id: Date.now(), createdAt: new Date().toISOString() }
    const updated = [...all, newBooking]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return newBooking
  },

  getBookedSeats(trainId, wagonNumber) {
    return this.getAll()
      .filter((b) => b.trainId === trainId && b.wagonNumber === wagonNumber)
      .flatMap((b) => b.seats)
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },
}
