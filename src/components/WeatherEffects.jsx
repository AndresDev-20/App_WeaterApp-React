import { useMemo } from 'react'
import './effects.css'

const random = (min, max) => Math.random() * (max - min) + min

const makeParticles = (count, build) => Array.from({ length: count }, (_, i) => ({ id: i, ...build() }))

const WeatherEffects = ({ condition }) => {
  const particles = useMemo(() => {
    switch (condition) {
      case 'rain':
      case 'storm':
        return makeParticles(condition === 'storm' ? 110 : 80, () => ({
          left: random(-5, 105),
          delay: random(-2, 0),
          duration: random(0.5, 0.9),
          opacity: random(0.25, 0.7),
        }))
      case 'snow':
        return makeParticles(70, () => ({
          left: random(0, 100),
          delay: random(-12, 0),
          duration: random(7, 14),
          size: random(3, 8),
          opacity: random(0.5, 1),
        }))
      case 'night':
      case 'night-clouds':
        return makeParticles(80, () => ({
          left: random(0, 100),
          top: random(0, 70),
          delay: random(0, 4),
          duration: random(2, 5),
          size: random(1, 3),
        }))
      default:
        return []
    }
  }, [condition])

  const clouds = useMemo(
    () => makeParticles(6, () => ({
      top: random(2, 45),
      delay: random(-80, 0),
      duration: random(55, 95),
      scale: random(0.6, 1.4),
      opacity: random(0.25, 0.55),
    })),
    []
  )

  const showClouds = ['clouds', 'night-clouds', 'rain', 'storm', 'snow'].includes(condition)

  return (
    <div className={`effects effects--${condition}`} aria-hidden="true">
      {condition === 'clear' && (
        <div className="sun">
          <div className="sun__rays" />
          <div className="sun__core" />
        </div>
      )}

      {(condition === 'night' || condition === 'night-clouds') && (
        <>
          <div className="moon" />
          {particles.map(p => (
            <span
              key={p.id}
              className="star"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </>
      )}

      {showClouds && clouds.map(c => (
        <span
          key={c.id}
          className="cloud"
          style={{
            top: `${c.top}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            '--scale': c.scale,
            '--opacity': c.opacity,
          }}
        />
      ))}

      {(condition === 'rain' || condition === 'storm') && particles.map(p => (
        <span
          key={p.id}
          className="drop"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}

      {condition === 'storm' && <div className="flash" />}

      {condition === 'snow' && particles.map(p => (
        <span
          key={p.id}
          className="flake"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {condition === 'mist' && (
        <>
          <div className="fog fog--1" />
          <div className="fog fog--2" />
          <div className="fog fog--3" />
        </>
      )}
    </div>
  )
}

export default WeatherEffects
