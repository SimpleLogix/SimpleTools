export interface WeatherData {
  geolocation: GeolocationData
  dailyTemps: Array<DailyTemp>
  currentTemp: number
  weatherCode: number
  isDay: boolean
  time: string
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

// returns the ip address of the client
const getIpAddr = async (): Promise<string> => {
  let ipAddr: string | undefined = ''
  await fetch('https://1.1.1.1/cdn-cgi/trace')
    .then(res => res.text())
    .then(str => (ipAddr = str.match(/ip=(\S+)/)?.[1]))
  return ipAddr
}

// returns the [long, lat] geolocation of the client
// makes a request to the public ip-api server
const getGeolocationData = async (): Promise<GeolocationData> => {
  let geoData: GeolocationData = {
    city: '',
    longitude: 0,
    latitude: 0
  }
  const ip = await getIpAddr()
  await fetch(`http://ip-api.com/json/${ip}`)
    .then(response => response.json())
    .then(data => {
      geoData.latitude = data.lat
      geoData.longitude = data.lon
      geoData.city = data.city
    })
  return geoData
}

// returns the current weather and some other stats of the client
export const fetchWeatherData = async (
  latitude?: number,
  longitude?: number,
  city?: string
): Promise<WeatherData> => {
  let geoData: GeolocationData
  if (!latitude || !longitude || !city) {
    geoData = await getGeolocationData()
  } else {
    geoData = {
      city: city,
      longitude: longitude,
      latitude: latitude
    }
  }
  // build query url with pararmerts
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.append('latitude', geoData.latitude.toString())
  url.searchParams.append('longitude', geoData.longitude.toString())
  url.searchParams.append('current_weather', 'true')
  url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,weathercode')
  url.searchParams.append('temperature_unit', 'fahrenheit')
  url.searchParams.append('timezone', 'auto')

  // make request
  const response = await fetch(url)
  const json = await response.json()
  const dailyTemps: Array<DailyTemp> = []

  // parse response into DailyTemp interface
  for (let i = 0; i < 7; i++) {
    const dailyTemp: DailyTemp = {
      dayOfWeek: isoDayOfWeek(json.daily.time[i]),
      min: json.daily.temperature_2m_min[i],
      max: json.daily.temperature_2m_max[i],
      avg: avgTemp(
        json.daily.temperature_2m_min[i],
        json.daily.temperature_2m_max[i]
      ),
      weatherCode: json.daily.weathercode[i]
    }
    dailyTemps.push(dailyTemp)
  }

  const data: WeatherData = {
    geolocation: geoData,
    currentTemp: Math.round(json.current_weather.temperature),
    weatherCode: json.current_weather.weathercode,
    isDay: true,
    time: 'string',
    dailyTemps: dailyTemps
  }

  return data
}

// takes a full iso string (parsed from jason)
// and returns the day of the week
const isoDayOfWeek = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' }
  const shortDate = new Date(date)
  const utcDay = shortDate.getUTCDay()
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const formattedDate = daysOfWeek[utcDay]
  return formattedDate
}

const avgTemp = (min: number, max: number): number => {
  return Math.round((min + max) / 2)
}
