import TrainCard from './TrainCard'
import styles from './TrainList.module.css'

function TrainList({ trains, onSelect }) {
  if (trains.length === 0) {
    return (
      <div className={styles.empty}>
        <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
          <circle cx="32" cy="32" r="30" stroke="#e5e7eb" strokeWidth="2" />
          <path
            d="M20 24h24M20 32h16M20 40h10"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p>Рейсів не знайдено</p>
        <span>Спробуйте змінити параметри пошуку</span>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default TrainList
