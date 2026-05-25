import styles from './TrainCard.module.css'

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  })
}

function getWagonTypes(wagons) {
  const types = {}
  wagons.forEach((w) => {
    types[w.type] = (types[w.type] || 0) + 1
  })
  return Object.entries(types)
    .map(([type, count]) => `${type} (${count})`)
    .join(', ')
}

function TrainCard({ train, onSelect }) {
  const totalSeats = train.wagons.reduce((acc, w) => acc + w.seats, 0)
  const bookedSeats = train.wagons.reduce(
    (acc, w) => acc + w.bookedSeats.length,
    0
  )
  const freeSeats = totalSeats - bookedSeats

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.trainNumber}>
          <span className={styles.label}>Потяг</span>
          <span className={styles.number}>№ {train.number}</span>
        </div>
        <div className={styles.seatsInfo}>
          <span className={styles.freeSeats}>{freeSeats} місць</span>
          <span className={styles.seatsLabel}>вільно</span>
        </div>
      </div>

      <div className={styles.route}>
        <div className={styles.station}>
          <span className={styles.time}>{formatTime(train.departure)}</span>
          <span className={styles.city}>{train.from}</span>
        </div>

        <div className={styles.routeMiddle}>
          <span className={styles.duration}>{train.duration}</span>
          <div className={styles.routeLine}>
            <div className={styles.dot} />
            <div className={styles.line} />
            <svg className={styles.trainIcon} viewBox="0 0 24 24" fill="none">
              <path
                d="M4 15H2V9h2M20 15h2V9h-2M6 5h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2zM9 17l-1 2M15 17l1 2M8 9h8M8 12h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.line} />
            <div className={styles.dot} />
          </div>
          <span className={styles.date}>{formatDate(train.departure)}</span>
        </div>

        <div className={`${styles.station} ${styles.stationRight}`}>
          <span className={styles.time}>{formatTime(train.arrival)}</span>
          <span className={styles.city}>{train.to}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.wagonTypes}>
          <span className={styles.wagonLabel}>Вагони:</span>
          <span className={styles.wagonValue}>{getWagonTypes(train.wagons)}</span>
        </div>
        <button className={styles.bookBtn} onClick={() => onSelect(train.id)}>
          Обрати місця
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TrainCard
