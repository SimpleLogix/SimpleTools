import { fetchWeatherData, WeatherData, DailyTemp } from './services.js'
import { weatherCodeInfo, weatherCodeImg } from './weathercodes.js'

// Fetch the current weather data
let weatherData: WeatherData = await fetchWeatherData()

// load in document models
for (let i = 0; i < 7; i++) {
  const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`)
  const tempElem = document.getElementById(`forecast-temp-${i}`)

  // set the temps and doay of week
  if (i == 0) {

    tempElem!.textContent = weatherData.currentTemp + '°C'

    //set the image source to the weathercode
    weatherCodeElem!.setAttribute(
      'src',
      weatherCodeImg.get(weatherData.weatherCode)!
    )


  } else {
    const dayElem = document.getElementById(`forecast-day-${i}`)
    tempElem!.textContent = weatherData.dailyTemps[i].avg + '°C'
    dayElem!.textContent = weatherData.dailyTemps[i].dayOfWeek

    const src = weatherCodeImg.get(weatherData.weatherCode)

    //set the image source to the weathercode (div -> img)
    const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`)!
    weatherCodeElem.classList.remove("lds-ripple")
    weatherCodeElem.innerHTML = `<img id="forecast-weathercode-${i}  class="forecast-weathercode" src="${src}" width="75">`
  }
}


