import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Weather from './components/Weather'
import Loading from './components/Loading'
import WeatherEffects from './components/WeatherEffects'
import Icon from './components/Icon'
import style from './utils/style'
import { getCondition } from './utils/condition'

const background = [1, 2, 3, 4, 5, 6, 7]
const apiKey = '4f616028d15fe2aec507964cdb43e2b2'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'
// Si el usuario no comparte su ubicación usamos Bogotá
const defaultCoords = { lat: 4.711, lon: -74.0721 }

function App() {
  const [moneyRandom, setMoneyRandom] = useState(() => style(background))
  const [weather, setweather] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const changeBackground = useCallback(() => {
    setMoneyRandom(prev => style(background.filter(n => n !== prev)))
  }, [])

  const fetchWeather = useCallback(params => {
    setLoading(true)
    setError('')
    axios.get(apiUrl, { params: { ...params, appid: apiKey, units: 'metric', lang: 'es' } })
      .then(res => {
        setweather(res.data)
        changeBackground()
      })
      .catch(err => {
        setError(err.response?.status === 404
          ? 'No encontramos esa ciudad. Revisa el nombre e intenta de nuevo.'
          : 'No pudimos obtener el clima. Revisa tu conexión.')
      })
      .finally(() => setLoading(false))
  }, [changeBackground])

  const locate = useCallback(() => {
    if (!navigator.geolocation) return fetchWeather(defaultCoords)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => fetchWeather(defaultCoords),
      { timeout: 10000 }
    )
  }, [fetchWeather])

  useEffect(() => { locate() }, [locate])

  const condition = getCondition(weather)

  return (
    <div className={`App theme-${condition}`}>
      <div
        key={moneyRandom}
        className="App__bg"
        style={{ backgroundImage: `url('./image/fondo${moneyRandom}.jpg')` }}
      />
      <div className="App__overlay" />
      {weather && <WeatherEffects condition={condition} />}

      {weather ? (
        <Weather
          app={weather}
          loading={loading}
          error={error}
          onSearch={city => fetchWeather({ q: city })}
          onLocate={locate}
          clickbutton={changeBackground}
        />
      ) : error ? (
        <div className="fatal glass">
          <Icon name="alert" size={42} />
          <p>{error}</p>
          <button className="btn btn--primary" onClick={locate}>Reintentar</button>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default App
