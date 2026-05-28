import { useState } from 'react'
import { useBooking } from '../context/BookingContext'
import styles from './BookingForm.module.css'

function validate(fields) {
  const errors = {}
  if (!fields.name.trim() || fields.name.trim().length < 2) {
    errors.name = "Введіть ім'я (мінімум 2 символи)"
  }
  if (!/^\+?[\d\s\-()]{9,15}$/.test(fields.phone.replace(/\s/g, ''))) {
    errors.phone = 'Введіть коректний номер телефону'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Введіть коректний email'
  }
  return errors
}

function Toast({ message, onClose }) {
  return (
    <div className={styles.toastOverlay}>
      <div className={styles.toast}>
        <div className={styles.toastIcon}>
          <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
            <circle cx="12" cy="12" r="10" fill="#059669" />
            <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className={styles.toastContent}>
          <p className={styles.toastTitle}>Бронювання успішне!</p>
          <p className={styles.toastMsg}>{message}</p>
        </div>
        <button className={styles.toastClose} onClick={onClose} aria-label="Закрити">✕</button>
      </div>
    </div>
  )
}

function BookingForm() {
  const { selectedTrain, selectedWagon, selectedSeats, saveBooking, resetBooking } = useBooking()
  const [fields, setFields] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = selectedSeats.length > 0

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    // Simulate async save
    await new Promise((r) => setTimeout(r, 600))
    const booking = saveBooking(fields)
    setLoading(false)
    setToast(
      `Потяг №${booking.trainNumber}, вагон ${booking.wagonNumber}, місця: ${booking.seats.join(', ')}`
    )
    setFields({ name: '', phone: '', email: '' })
    setErrors({})
    resetBooking()
  }

  if (!selectedTrain || !selectedWagon) return null

  return (
    <>
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Дані пасажира</h3>

        {!canSubmit && (
          <div className={styles.hint}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Спочатку оберіть місця на схемі вагону
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Ім'я та прізвище
            </label>
            <input
              id="name"
              name="name"
              className={`${styles.input} ${errors.name ? styles.invalid : ''}`}
              type="text"
              placeholder="Наприклад: Іван Петренко"
              value={fields.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              Номер телефону
            </label>
            <input
              id="phone"
              name="phone"
              className={`${styles.input} ${errors.phone ? styles.invalid : ''}`}
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={fields.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className={`${styles.input} ${errors.email ? styles.invalid : ''}`}
              type="email"
              placeholder="example@mail.com"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          {selectedSeats.length > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Місця:</span>
                <span className={styles.summaryValue}>
                  {selectedSeats.sort((a, b) => a - b).join(', ')}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Вагон:</span>
                <span className={styles.summaryValue}>
                  №{selectedWagon.number} ({selectedWagon.type})
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Рейс:</span>
                <span className={styles.summaryValue}>
                  {selectedTrain.number} · {selectedTrain.from} → {selectedTrain.to}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Забронювати {selectedSeats.length > 0 ? `(${selectedSeats.length} ${selectedSeats.length === 1 ? 'місце' : 'місця'})` : ''}
              </>
            )}
          </button>
        </form>
      </div>
    </>
  )
}

export default BookingForm
