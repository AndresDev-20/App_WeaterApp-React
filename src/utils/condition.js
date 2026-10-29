// Agrupa el estado de OpenWeather en un "tema" visual para la app
export const getCondition = weather => {
  if (!weather) return 'clear'
  const { main, icon } = weather.weather[0]
  const night = icon.endsWith('n')

  if (main === 'Thunderstorm') return 'storm'
  if (main === 'Rain' || main === 'Drizzle') return 'rain'
  if (main === 'Snow') return 'snow'
  if (main === 'Clear') return night ? 'night' : 'clear'
  if (main === 'Clouds') return night ? 'night-clouds' : 'clouds'
  return 'mist'
}

// Hora local de la ciudad a partir de un timestamp unix y su desfase en segundos
export const cityDate = (unix, timezone) => new Date((unix + timezone) * 1000)

export const formatTime = date =>
  date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

export const formatDate = date =>
  date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

export const toFahrenheit = celsius => celsius * 9 / 5 + 32
