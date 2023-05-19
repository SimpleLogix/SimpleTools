import { loadWeatherData, getCityWeatherData, WeatherData } from './services.js'
import { weatherCodeImg } from './weathercodes.js'
import { refreshImage } from './urls.js'

// Fetch the current weather data
let weatherData: WeatherData;
weatherData = await loadWeatherData()

// Update the weather data elements
setWeatherData();

// add listeners to refresh button and input field
const inputElem = document.getElementById('city-input') as HTMLInputElement;
inputElem.addEventListener('keydown', async function (e) {
  if (e.key === 'Enter') {  // Check if the pressed key was 'Enter'
    e.preventDefault();  // Prevent the form from submitting normally
    console.log(this.value);
    weatherData = await getCityWeatherData(this.value);
    setWeatherData();
    //console.log('Submite2d: ', weatherData2.geolocation.city);
  }
});

// refresh background image
const refreshButton: HTMLElement = document.getElementById('refresh-button')!
refreshButton.addEventListener('click', await refreshImage)


// Updates elements in the DOM based on the weather data
function setWeatherData() {
  console.log('setting weather data')
  // load in document models
  for (let i = 0; i < 7; i++) {
    const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`)
    const tempHiElem = document.getElementById(`forecast-high-${i}`)
    const tempLowElem = document.getElementById(`forecast-low-${i}`)

    //? TODAY's Forecast
    if (i == 0) {
      // set the forecast for today
      document.getElementById("feels")!.textContent = weatherData.apparentTemp + "° F"
      document.getElementById("wind")!.textContent = weatherData.wind

      // set the current temp
      const currentTempElem = document.getElementById('forecast-temp-0')
      currentTempElem!.textContent = weatherData.currentTemp + "° F"

      //set the image source to the weathercode
      weatherCodeElem!.setAttribute(
        'src',
        weatherCodeImg.get(weatherData.weatherCode)!
      )

      // set city info
      const inputElem = document.getElementById("city-input") as HTMLInputElement
      inputElem.value = weatherData.geolocation.city


    } // else, rest of the week forecast 
    else {
      // set day of week element
      const dateElem = document.getElementById(`forecast-day-${i}`)
      dateElem!.textContent = weatherData.dailyTemps[i].dayOfWeek

      // remove loader animation
      //set the image source to the weathercode (div -> img)
      const src = weatherCodeImg.get(weatherData.dailyTemps[i].weatherCode)
      const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`)!
      weatherCodeElem.classList.remove("loader")
      weatherCodeElem.innerHTML = `<img id="forecast-weathercode-${i}  class="forecast-weathercode" src="${src}" width="75">`

      // set the temperature range
      const rangeBarElem: HTMLElement = document.getElementById(`range-bar-${i}`)!
      let range = (weatherData.dailyTemps[i].max - weatherData.dailyTemps[i].min)
      if (range < 12) {
        range = 12;
      }
      rangeBarElem.style.height = `${range}%`
      rangeBarElem.style.top = `${100 - weatherData.dailyTemps[i].max}%`
    }
    // remove loader animation from temp-bars
    document.getElementById(`temp-bar-${i}`)?.classList.remove("loader");

    // set low and high temps
    tempHiElem!.textContent = weatherData.dailyTemps[i].max + "° F"
    tempLowElem!.textContent = weatherData.dailyTemps[i].min + "° F"
  }
  console.log('weatherData set')
}
