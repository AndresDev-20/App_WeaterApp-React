import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { cityDate, formatDate, formatTime, toFahrenheit } from '../utils/condition'
import "./weather.css"

// Anima un número desde su valor anterior hasta el nuevo
const useCountUp = (target, duration = 1100) => {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let frame
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (target - from) * eased
      fromRef.current = current
      setValue(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

// Reloj con la hora local de la ciudad, se actualiza cada 30 s
const useCityClock = timezone => {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 30000)
    return () => clearInterval(id)
  }, [])
  return { unix: now, date: cityDate(now, timezone) }
}

const SunPath = ({ sunrise, sunset, now, timezone }) => {
  const progress = Math.min(Math.max((now - sunrise) / (sunset - sunrise), 0), 1)
  const angle = Math.PI * (1 - progress)
  const x = 50 + 40 * Math.cos(angle)
  const y = 50 - 40 * Math.sin(angle)

  return (
    <div className="sunpath">
      <svg viewBox="0 0 100 56" className="sunpath__svg">
        <path d="M10 50 A40 40 0 0 1 90 50" className="sunpath__track" pathLength="100" />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          className="sunpath__progress"
          pathLength="100"
          style={{ strokeDasharray: `${progress * 100} 100` }}
        />
        <line x1="4" y1="50" x2="96" y2="50" className="sunpath__horizon" />
        <circle cx={x} cy={y} r="4.5" className="sunpath__sun" />
      </svg>
      <div className="sunpath__labels">
        <span><small>Amanecer</small>{formatTime(cityDate(sunrise, timezone))}</span>
        <span><small>Atardecer</small>{formatTime(cityDate(sunset, timezone))}</span>
      </div>
    </div>
  )
}

const Weather = ({ app, loading, error, onSearch, onLocate, clickbutton }) => {
  const [change, setchange] = useState(true)
  const [city, setCity] = useState('')
  const clock = useCityClock(app.timezone)

  const celsius = app.main.temp
  const temperature = useCountUp(change ? celsius : toFahrenheit(celsius))
  const unit = change ? '°C' : '°F'
  const convert = value => Math.round(change ? value : toFahrenheit(value))

  const handelsearch = e => {
    e.preventDefault()
    const value = city.trim()
    if (!value) return
    onSearch(value)
    setCity('')
  }

  const stats = [
    { icon: 'thermometer', label: 'Sensación', value: `${convert(app.main.feels_like)}${unit}` },
    { icon: 'droplet', label: 'Humedad', value: `${app.main.humidity}%`, bar: app.main.humidity },
    {
      icon: 'wind',
      label: 'Viento',
      value: `${app.wind.speed.toFixed(1)} m/s`,
      extra: <Icon name="arrow" size={16} className="wind-dir" style={{ transform: `rotate(${(app.wind.deg ?? 0) + 180}deg)` }} />,
    },
    { icon: 'gauge', label: 'Presión', value: `${app.main.pressure} hPa` },
    { icon: 'cloud', label: 'Nubes', value: `${app.clouds.all}%`, bar: app.clouds.all },
    { icon: 'eye', label: 'Visibilidad', value: `${((app.visibility ?? 0) / 1000).toFixed(1)} km` },
  ]

  return (
    <article className='fhather'>
      <section className="app glass">
        <header className="app__header">
          <div className="brand">
            <Icon name="sun" size={26} className="brand__icon" />
            <h1>Weather App</h1>
          </div>

          <form className="search" onSubmit={handelsearch}>
            <Icon name="search" size={18} className="search__icon" />
            <input
              id='namecity'
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Buscar ciudad..."
              autoComplete="off"
              aria-label="Buscar ciudad"
            />
            <button className='button' type="submit" disabled={loading} aria-label="Buscar">
              {loading ? <span className="spinner" /> : 'Buscar'}
            </button>
          </form>

          <div className="actions">
            <button className="icon-btn" onClick={onLocate} title="Mi ubicación" aria-label="Usar mi ubicación">
              <Icon name="pin" size={18} />
            </button>
            <button className="icon-btn" onClick={clickbutton} title="Cambiar fondo" aria-label="Cambiar fondo">
              <Icon name="image" size={18} />
            </button>
          </div>
        </header>

        {error && (
          <div className="toast" role="alert" key={error}>
            <Icon name="alert" size={18} />
            {error}
          </div>
        )}

        <div className="app__body" key={`${app.id}-${app.dt}`}>
          <section className="hero">
            <div className="hero__place reveal" style={{ '--i': 0 }}>
              <h2 className='Name'>
                {app.name}
                <span className="pill">{app.sys.country}</span>
              </h2>
              <p className="hero__date">
                {formatDate(clock.date)} · <b>{formatTime(clock.date)}</b>
              </p>
            </div>

            <div className="hero__main reveal" style={{ '--i': 1 }}>
              <div className='Tem_Image'>
                <img
                  src={`https://openweathermap.org/img/wn/${app.weather[0].icon}@4x.png`}
                  alt={app.weather[0].description}
                />
              </div>
              <div className="hero__temp">
                <h2 className='Number'>
                  {Math.round(temperature)}
                  <span>{unit}</span>
                </h2>
                <p className="hero__desc">{app.weather[0].description}</p>
              </div>
            </div>

            <div className="hero__footer reveal" style={{ '--i': 2 }}>
              <div className="minmax">
                <span>Máx <b>{convert(app.main.temp_max)}°</b></span>
                <span>Mín <b>{convert(app.main.temp_min)}°</b></span>
              </div>

              <div className={`toggle ${change ? '' : 'toggle--f'}`} role="group" aria-label="Unidad de temperatura">
                <span className="toggle__pill" />
                <button id='temp' className={change ? 'active' : ''} onClick={() => setchange(true)}>°C</button>
                <button className={change ? '' : 'active'} onClick={() => setchange(false)}>°F</button>
              </div>
            </div>
          </section>

          <section className='info'>
            <div className="stats">
              {stats.map((stat, index) => (
                <div className="stat reveal" key={stat.label} style={{ '--i': index + 3 }}>
                  <div className="stat__head">
                    <Icon name={stat.icon} size={16} />
                    <span>{stat.label}</span>
                    {stat.extra}
                  </div>
                  <b className="stat__value">{stat.value}</b>
                  {stat.bar !== undefined && (
                    <div className="bar"><span style={{ width: `${stat.bar}%` }} /></div>
                  )}
                </div>
              ))}
            </div>

            <div className="stat stat--wide reveal" style={{ '--i': 9 }}>
              <div className="stat__head">
                <Icon name="sun" size={16} />
                <span>Recorrido del sol</span>
              </div>
              <SunPath
                sunrise={app.sys.sunrise}
                sunset={app.sys.sunset}
                now={clock.unix}
                timezone={app.timezone}
              />
            </div>
          </section>
        </div>

        <footer className="credits">
          <span>Diseñado y desarrollado por</span>
          <a
            className="credits__brand"
            href="https://github.com/AndresDev20"
            target="_blank"
            rel="noreferrer"
          >
            <span className="credits__bracket">&lt;</span>
            Andres<span className="credits__dot">.dev</span>
            <span className="credits__bracket">/&gt;</span>
          </a>
        </footer>
      </section>
    </article>
  )
}

export default Weather
