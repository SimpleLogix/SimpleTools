import { fetchWeatherData } from './services.js';
import { weatherCodeImg } from './weathercodes.js';
// Fetch the current weather data
let weatherData = await fetchWeatherData();
// load in document models
for (let i = 0; i < 7; i++) {
    const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`);
    const tempElem = document.getElementById(`forecast-temp-${i}`);
    // set the temps and doay of week
    if (i == 0) {
        tempElem.textContent = weatherData.currentTemp + '°C';
        //set the image source to the weathercode
        weatherCodeElem.setAttribute('src', weatherCodeImg.get(weatherData.weatherCode));
        // set city info
        const inputElem = document.getElementById("city");
        inputElem.value = weatherData.geolocation.city;
    }
    else {
        const dayElem = document.getElementById(`forecast-day-${i}`);
        tempElem.textContent = weatherData.dailyTemps[i].avg + '°C';
        dayElem.textContent = weatherData.dailyTemps[i].dayOfWeek;
        const src = weatherCodeImg.get(weatherData.dailyTemps[i].weatherCode);
        //set the image source to the weathercode (div -> img)
        const weatherCodeElem = document.getElementById(`forecast-weathercode-${i}`);
        weatherCodeElem.classList.remove("loader");
        weatherCodeElem.innerHTML = `<img id="forecast-weathercode-${i}  class="forecast-weathercode" src="${src}" width="75">`;
    }
}
