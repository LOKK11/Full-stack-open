import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from './components/Notification'

const FindCountries = ({searchWith, countriesToShow, handleSearchChange, setShow, show }) => (
    <div>
      <Filter searchWith={searchWith} handleSearchChange={handleSearchChange} />
      <Countries countriesToShow={countriesToShow} setShow={setShow} show={show} />
    </div>
)

const Filter = ({ searchWith, handleSearchChange }) => {
  return (
    <div>
      Find countries:
      <input
        value={searchWith}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const Countries = ({ countriesToShow, setShow, show }) => {
  
  const handleShow = (event) => {
    const countryName = event.target.value.toLowerCase()
    console.log('Show:', countryName)
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
    .then(response => {
      setShow(response.data)
      console.log('Country data:', response.data)
    })
    .catch(error => {
      console.error('Error fetching country data:', error)
    })
  }
  
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countriesToShow.length === 1) {
    return <Country country={countriesToShow[0]} />
  } else if (show) {
    return <Country country={show} />
  } else {
    return (
      <div>
        {
          countriesToShow.map(country =>
            <div key={country.name.common}>
              {country.name.common}
              <button value={country.name.common} onClick={handleShow}>Show</button>
            </div>
          )
        }
      </div>
    )
  }
}

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h3>Languages</h3>
      <ul>
        {
          Object.entries(country.languages).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))
        }
      </ul>
      <img src={country.flags.png} width="100" />
      <h2>Weather in {country.capital}</h2>
      <Weather country={country} />
    </div>
  )
}

const Weather = ({ country }) => {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  const [weather, setWeather] = useState(null)
  const [icon, setIcon] = useState('')
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
        console.log('Weather:', weatherResponse.data)
        setWeather(weatherResponse.data)

        const iconResponse = await axios.get(`https://openweathermap.org/img/wn/${weatherResponse.data.weather[0].icon}@2x.png`)
        console.log('Icon:', iconResponse.config.url)
        setIcon(iconResponse.config.url)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchWeather()
  }, [country.capital, api_key])

  if (!weather) {
    return <div>Loading weather data...</div>
  }
  console.log('Weather:', weather)
  return (
    <div>
      <div><strong>Temperature:</strong> {weather.main.temp}°C</div>
      <img src={icon} width="100" />
      <div><strong>Wind:</strong> {weather.wind.speed} m/s</div>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchWith, setSearchWith] = useState('')
  const [show, setShow] = useState(false)
  
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchWith(event.target.value)
    setShow(false)
  }

  const hook = () => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }
  useEffect(hook, [])

  const countriesToShow = searchWith === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(searchWith.toLowerCase()))

  return (
    <FindCountries 
      searchWith={searchWith}
      countriesToShow={countriesToShow} 
      handleSearchChange={handleSearchChange}
      setShow={setShow}
      show={show}
    />
  )

}

export default App