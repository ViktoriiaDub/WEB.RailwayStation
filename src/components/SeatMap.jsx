import { useBooking } from '../context/BookingContext'
import styles from './SeatMap.module.css'

// Generates seat layout rows for different wagon types
function generateLayout(wagonType, totalSeats) {
  // Купе / СВ: 4 seats per compartment (2 lower + 2 upper)
  // Плацкарт: 8 seats per section (4 main + 4 side)

  if (wagonType === 'Плацкарт') {
    const rows = []
    let seat = 1
    while (seat <= totalSeats) {
      const mainBunk = []
      for (let i = 0; i < 4 && seat <= totalSeats; i++, seat++) {
        mainBunk.push(seat)
      }
      const sideBunk = []
      for (let i = 0; i < 2 && seat <= totalSeats; i++, seat++) {
        sideBunk.push(seat)
      }
      rows.push({ type: 'platzkart', main: mainBunk, side: sideBunk })
    }
    return rows
  }

  // Купе / СВ: compartments of 4
  const compartmentSize = wagonType === 'СВ' ? 2 : 4
  const rows = []
  let seat = 1
  while (seat <= totalSeats) {
    const compartment = []
    for (let i = 0; i < compartmentSize && seat <= totalSeats; i++, seat++) {
      compartment.push(seat)
    }
    rows.push({ type: 'coupe', seats: compartment })
  }
  return rows
}

function SeatMap() {
  const {
    selectedTrain,
    selectedWagon,
    selectedSeats,
    toggleSeat,
    getBookedSeatsForWagon,
  } = useBooking()

  if (!selectedTrain || !selectedWagon) return null

  const extraBooked = getBookedSeatsForWagon(selectedTrain.id, selectedWagon.number)
  const allBooked = new Set([...selectedWagon.bookedSeats, ...extraBooked])

  const layout = generateLayout(selectedWagon.type, selectedWagon.seats)

  function getSeatStatus(seatNum) {
    if (allBooked.has(seatNum)) return 'booked'
    if (selectedSeats.includes(seatNum)) return 'selected'
    return 'free'
  }

  function Seat({ num }) {
    const status = getSeatStatus(num)
    return (
      <button
        className={`${styles.seat} ${styles[status]}`}
        onClick={() => status !== 'booked' && toggleSeat(num)}
        disabled={status === 'booked'}
        title={status === 'booked' ? `Місце ${num} — заброньовано` : `Місце ${num}`}
        aria-label={`Місце ${num} — ${status === 'booked' ? 'заброньовано' : status === 'selected' ? 'обрано' : 'вільне'}`}
      >
        {num}
      </button>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Вагон {selectedWagon.number} · {selectedWagon.type}
        </h3>
        <div className={styles.selected}>
          {selectedSeats.length > 0
            ? `Обрано: ${selectedSeats.sort((a, b) => a - b).join(', ')}`
            : 'Оберіть місця'}
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.free}`} />
          Вільне
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.selected}`} />
          Обране
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.booked}`} />
          Заброньоване
        </span>
      </div>

      <div className={styles.wagon}>
        {/* Wagon body */}
        <div className={styles.wagonBody}>
          {selectedWagon.type === 'Плацкарт' ? (
            <div className={styles.platzkartGrid}>
              {layout.map((row, i) => (
                <div key={i} className={styles.platzkartRow}>
                  <div className={styles.platzkartMain}>
                    <div className={styles.bunkPair}>
                      {row.main.slice(0, 2).map((num) => <Seat key={num} num={num} />)}
                    </div>
                    <div className={styles.bunkPair}>
                      {row.main.slice(2, 4).map((num) => <Seat key={num} num={num} />)}
                    </div>
                  </div>
                  {row.side.length > 0 && (
                    <div className={styles.platzkartSide}>
                      {row.side.map((num) => <Seat key={num} num={num} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.coupeGrid}>
              {layout.map((comp, i) => (
                <div key={i} className={styles.compartment}>
                  <div className={styles.compNumber}>Купе {i + 1}</div>
                  <div className={styles.compSeats}>
                    {comp.seats.map((num) => <Seat key={num} num={num} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SeatMap
