export const weatherCodeInfo = new Map([
    [0, 'Clear sky'],
    [1, 'Mainly clear'],
    [2, 'Partly cloudy'],
    [3, 'Overcast'],
    [45, 'Fog and depositing rime fog'],
    [48, 'Fog and depositing rime fog'],
    [51, 'Drizzle: Light intensity'],
    [53, 'Drizzle: Moderate intensity'],
    [55, 'Drizzle: Dense intensity'],
    [56, 'Freezing Drizzle: Light intensity'],
    [57, 'Freezing Drizzle: Dense intensity'],
    [61, 'Rain: Slight intensity'],
    [63, 'Rain: Moderate intensity'],
    [65, 'Rain: Heavy intensity'],
    [66, 'Freezing Rain: Light intensity'],
    [67, 'Freezing Rain: Heavy intensity'],
    [71, 'Snow fall: Slight intensity'],
    [73, 'Snow fall: Moderate intensity'],
    [75, 'Snow fall: Heavy intensity'],
    [77, 'Snow grains'],
    [80, 'Rain showers: Slight intensity'],
    [81, 'Rain showers: Moderate intensity'],
    [82, 'Rain showers: Violent intensity'],
    [85, 'Snow showers slight'],
    [86, 'Snow showers heavy'],
    [95, 'Thunderstorm: Slight or moderate'],
    [96, 'Thunderstorm with slight hail'],
    [99, 'Thunderstorm with heavy hail']
]);
export const weatherCodeImg = new Map([
    [0, "../assets/weather/sun.png"],
    [1, "../assets/weather/sun.png"],
    [2, "../assets/weather/partly_cloudy.png"],
    [3, "../assets/weather/overcast.png"],
    [45, "../assets/weather/fog.png"],
    [48, "../assets/weather/fog.png"],
    [51, "../assets/weather/light_drizzle.png"],
    [53, "../assets/weather/moderate_drizzle.png"],
    [55, "../assets/weather/moderate_drizzle.png"],
    [56, "../assets/weather/freezing_light_drizzle.png"],
    [57, "../assets/weather/freezing_dense_drizzle.png"],
    [61, "../assets/weather/light_rain.png"],
    [63, "../assets/weather/dense_rain.png"],
    [65, "../assets/weather/dense_rain.png"],
    [66, "../assets/weather/freezing_light_drizzle.png"],
    [67, "../assets/weather/freezing_dense_drizzle.png"],
    [71, "../assets/weather/light_snow.png"],
    [73, "../assets/weather/moderate_snow.png"],
    [75, "../assets/weather/heavy_snow.png"],
    [77, "../assets/weather/heavy_snow.png"],
    [80, "../assets/weather/light_rain.png"],
    [81, "../assets/weather/dense_rain.png"],
    [82, "../assets/weather/dense_rain.png"],
    [85, "../assets/weather/light_snow.png"],
    [86, "../assets/weather/heavy_snow.png"],
    [95, "../assets/weather/light_thunder.png"],
    [96, "../assets/weather/heavy_thunder.png"],
    [99, "../assets/weather/heavy_thunder.png"] // heavy snow + thunderstorm
]);
// todo: create a night version
