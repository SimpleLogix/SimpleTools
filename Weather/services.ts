export interface WeatherData {
  geolocation: GeolocationData
  dailyTemps: Array<DailyTemp>
  currentTemp: number
  apparentTemp: number
  weatherCode: number
  time: string
  isDay: boolean
  wind: string
  weeklyMin: number
  weeklyMax: number
  weeklyRange: number
}

interface GeolocationData {
  city: string
  longitude: number
  latitude: number
}

export interface DailyTemp {
  dayOfWeek: string
  min: number
  max: number
  avg: number
  weatherCode: number
}

const STORAGE_KEY = 'weather-data'
const EXPIRY_TIME = 1000 * 60 * 60 * 0.25 // 15 min

// returns the [long, lat] geolocation of the client
// makes a request to the public ip-api server
const getGeolocationData = (): Promise<GeolocationData> =>
  new Promise((resolve, reject) => {
    const error = new Error('Geolocation is not supported by this browser.')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          resolve({ latitude, longitude, city: '' })
        },
        error => {
          console.log(error)
          reject(error)
        }
      )
    } else {
      console.log(error)
      reject(error)
    }
  })

// returns the current weather and some other stats of the client
const fetchWeatherData = async (city?: string
): Promise<WeatherData> => {

  // build request url
  const url = new URL('https://simpleapi.online/forecast')

  // get geo coords if city name not provided
  if (!city) {
    // fetch geo data
    let geoData: GeolocationData = await getGeolocationData()

    // build query url with pararmerts
    url.searchParams.append('lon', geoData.longitude.toString())
    url.searchParams.append('lat', geoData.latitude.toString())
  } else {
    url.searchParams.append('city', city!);
  }

  // make request
  const response = await fetch(url)
  const json = await response.json()
  const weatherData = json.data
  const dailyTemps: Array<DailyTemp> = []

  // parse response into DailyTemp interface
  for (let i = 0; i < 7; i++) {
    const dailyTemp: DailyTemp = {
      dayOfWeek: weatherData.dailyTemps[i].dayOfWeek,
      min: weatherData.dailyTemps[i].min,
      max: weatherData.dailyTemps[i].max,
      avg: weatherData.dailyTemps[i].avg,
      weatherCode: weatherData.dailyTemps[i].weatherCode,
    }
    dailyTemps.push(dailyTemp)
  }

  // put daily temps into the data object
  const data: WeatherData = {
    geolocation: weatherData.geolocation,
    currentTemp: weatherData.currentTemp,
    apparentTemp: weatherData.apparentTemp,
    wind: weatherData.wind,
    weatherCode: weatherData.weatherCode,
    time: weatherData.time,
    isDay: weatherData.isday,
    weeklyMin: weatherData.weeklyMin,
    weeklyMax: weatherData.weeklyMax,
    weeklyRange: weatherData.weeklyRange,
    dailyTemps: dailyTemps
  }

  return data
}

// stores the data in local storage
function storeWeatherData(data: WeatherData): void {
  const item = {
    data: data,
    timestamp: new Date().getTime()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
}

// retrieves the data from local storage
// if no data is found, fetches the data from the public api
// if passed with a param, fetches data for that city
export async function loadWeatherData(): Promise<WeatherData> {
  const data = localStorage.getItem(STORAGE_KEY);

  // If the item doesn't exist, fetch data, store it, and return request
  if (!data) {
    const weatherData = await fetchWeatherData();
    storeWeatherData(weatherData);
    return weatherData;
  }
  else {
    const item = JSON.parse(data);
    const now = new Date().getTime();

    // if data is older than EXPIRY_TIME, delete the item
    // fetch new data
    if (now - item.timestamp > EXPIRY_TIME) { // 3 hours
      localStorage.removeItem(STORAGE_KEY);
      const weatherData = await fetchWeatherData();
      storeWeatherData(weatherData);
      return weatherData;
    }
    return item.data as WeatherData;
  }

}

// returns weather data from city name
export async function getCityWeatherData(city: string): Promise<WeatherData> {
  // fetch data with param
  const weatherData = await fetchWeatherData(city);
  // save data to local storage
  storeWeatherData(weatherData);
  return weatherData;
}