import { useBooking } from '../context/BookingContext'
import styles from './WagonSelector.module.css'

const WAGON_TYPE_ICONS = {
  'Купе': (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 6V4M17 6V4M3 11h18M9 11v8M15 11v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Плацкарт': (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 10h18M3 15h18M8 5v14M16 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'СВ': (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 13h18M12 7v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7.5" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="16.5" cy="10" r="1.5" fill="currentColor"/>
    </svg>
  ),
}

function WagonSelector() {
  const { selectedTrain, selectedWagon, selectWagon, getBookedSeatsForWagon } = useBooking()

  if (!selectedTrain) return null

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Оберіть вагон</h3>
      <div className={styles.list}>
        {selectedTrain.wagons.map((wagon) => {
          const extraBooked = getBookedSeatsForWagon(selectedTrain.id, wagon.number)
          const totalBooked = new Set([...wagon.bookedSeats, ...extraBooked]).size
          const free = wagon.seats - totalBooked
          const isActive = selectedWagon?.id === wagon.id

          return (
            <button
              key={wagon.id}
              className={`${styles.wagonBtn} ${isActive ? styles.active : ''} ${free === 0 ? styles.full : ''}`}
              onClick={() => free > 0 && selectWagon(wagon)}
              disabled={free === 0}
              title={free === 0 ? 'Місць немає' : `${free} вільних місць`}
            >
              <div className={styles.wagonIcon}>
                {WAGON_TYPE_ICONS[wagon.type] || WAGON_TYPE_ICONS['Купе']}
              </div>
              <div className={styles.wagonInfo}>
                <span className={styles.wagonNum}>Вагон {wagon.number}</span>
                <span className={styles.wagonType}>{wagon.type}</span>
              </div>
              <div className={styles.wagonSeats}>
                <span className={`${styles.freeCount} ${free === 0 ? styles.zero : ''}`}>
                  {free === 0 ? '—' : free}
                </span>
                <span className={styles.freeLabel}>{free === 0 ? 'немає місць' : 'вільно'}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WagonSelector
