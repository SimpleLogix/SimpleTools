// returns the [long, lat] geolocation of the client
// makes a request to the public ip-api server
const getGeolocationData = () => new Promise((resolve, reject) => {
    const error = new Error('Geolocation is not supported by this browser.');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude, city: '' });
        }, error => {
            console.log(error);
            reject(error);
        });
    }
    else {
        console.log(error);
        reject(error);
    }
});
// returns the current weather and some other stats of the client
export const fetchWeatherData = async () => {
    // fetch geo data
    let geoData = await getGeolocationData();
    // build query url with pararmerts
    const url = new URL('https://simpleapi.online/forecast');
    url.searchParams.append('lon', geoData.longitude.toString());
    url.searchParams.append('lat', geoData.latitude.toString());
    // make request
    const response = await fetch(url);
    const json = await response.json();
    const weatherData = json.data;
    const dailyTemps = [];
    // parse response into DailyTemp interface
    for (let i = 0; i < 7; i++) {
        const dailyTemp = {
            dayOfWeek: weatherData.dailyTemps[i].dayOfWeek,
            min: weatherData.dailyTemps[i].min,
            max: weatherData.dailyTemps[i].max,
            avg: weatherData.dailyTemps[i].avg,
            weatherCode: weatherData.dailyTemps[i].weatherCode,
        };
        dailyTemps.push(dailyTemp);
    }
    // put daily temps into the data object
    const data = {
        geolocation: weatherData.geolocation,
        currentTemp: weatherData.currentTemp,
        weatherCode: weatherData.weatherCode,
        isDay: weatherData.isday,
        time: weatherData.time,
        dailyTemps: dailyTemps
    };
    return data;
};
