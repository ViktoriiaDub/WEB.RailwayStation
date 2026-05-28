import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { trains } from '../data/trains'
import { useBooking } from '../context/BookingContext'
import WagonSelector from '../components/WagonSelector'
import SeatMap from '../components/SeatMap'
import BookingForm from '../components/BookingForm'
import styles from './Booking.module.css'

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

function Booking() {
  const { trainId } = useParams()
  const navigate = useNavigate()
  const { selectTrain, selectedTrain, selectedWagon } = useBooking()

  const train = trains.find((t) => t.id === Number(trainId))

  useEffect(() => {
    if (!train) { navigate('/'); return }
    selectTrain(train)
  }, [trainId])

  if (!train) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.backBtn}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Назад
          </Link>
          <div className={styles.logo}>
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="#1a56db"/>
              <path d="M8 10h16a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2zM11 22l-1 2M21 22l1 2M9 14h14M9 17h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className={styles.logoTitle}>УкрЗалізниця</span>
          </div>
        </div>
      </header>

      <div className={styles.trainBanner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerNum}>№ {train.number}</div>
          <div className={styles.bannerRoute}>
            <span>{train.from}</span>
            <div className={styles.bannerArrow}>
              <div className={styles.bannerLine}/>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className={styles.bannerLine}/>
            </div>
            <span>{train.to}</span>
          </div>
          <div className={styles.bannerTime}>
            {formatTime(train.departure)} → {formatTime(train.arrival)} · {train.duration}
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.steps}>
          <div className={`${styles.step} ${styles.active}`}>
            <span className={styles.stepNum}>1</span> Вагон
          </div>
          <div className={styles.stepDivider}/>
          <div className={`${styles.step} ${selectedWagon ? styles.active : ''}`}>
            <span className={styles.stepNum}>2</span> Місця
          </div>
          <div className={styles.stepDivider}/>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span> Бронювання
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.left}>
            <WagonSelector />
          </div>
          <div className={styles.right}>
            <SeatMap />
            <BookingForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Booking
