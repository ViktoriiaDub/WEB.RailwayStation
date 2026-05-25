import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrainList from '../components/TrainList'
import { trains } from '../data/trains'
import styles from './Home.module.css'

function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = trains.filter((train) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      train.number.toLowerCase().includes(q) ||
      train.from.toLowerCase().includes(q) ||
      train.to.toLowerCase().includes(q)
    )
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
              <rect width="32" height="32" rx="8" fill="#1a56db" />
              <path
                d="M8 10h16a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2zM11 22l-1 2M21 22l1 2M9 14h14M9 17h8"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <span className={styles.logoTitle}>УкрЗалізниця</span>
              <span className={styles.logoSub}>Онлайн бронювання</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Знайди свій потяг</h1>
          <p className={styles.heroSub}>
            Пошук рейсів, вибір місць та бронювання квитків
          </p>

          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              width="20"
              height="20"
            >
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
              <path
                d="M20 20l-3-3"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Місто відправлення, прибуття або № потяга..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch('')}
                aria-label="Очистити пошук"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            {search ? `Результати: "${search}"` : 'Усі рейси'}
          </h2>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'рейс' : 'рейсів'}
          </span>
        </div>

        <TrainList
          trains={filtered}
          onSelect={(id) => navigate(`/booking/${id}`)}
        />
      </main>
    </div>
  )
}

export default Home
