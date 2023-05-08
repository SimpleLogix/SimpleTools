export const weatherCodeInfo: Map<number, string> = new Map([
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
])

export const weatherCodeImg: Map<number, string> = new Map([
    [0, "../assets/weather/sun.png"], // clear sky
    [1, "../assets/weather/sun.png"], // cloudy
    [2, "../assets/weather/partly_cloudy.png"], // cloudy
    [3, "../assets/weather/overcast.png"], // overcast
    [45, "../assets/weather/fog.png"], // fog
    [48, "../assets/weather/fog.png"],// fog
    [51, "../assets/weather/light_drizzle.png"],
    [53, "../assets/weather/moderate_drizzle.png"], // moderate drizzle
    [55, "../assets/weather/moderate_drizzle.png"], // dense drizzle
    [56, "../assets/weather/freezing_light_drizzle.png"], // freezing light drizzle
    [57, "../assets/weather/freezing_dense_drizzle.png"], // freezing dense drizzle
    [61, "../assets/weather/light_rain.png"], // slight rain
    [63, "../assets/weather/dense_rain.png"], // moderate rain
    [65, "../assets/weather/dense_rain.png"], // heavy rain
    [66, "../assets/weather/freezing_light_drizzle.png"], // freezing rain
    [67, "../assets/weather/freezing_dense_drizzle.png"], // moderate freezing rain
    [71, "../assets/weather/light_snow.png"], // slight snowfall
    [73, "../assets/weather/moderate_snow.png"], // moderate snowfall
    [75, "../assets/weather/heavy_snow.png"], // heavy snowfall
    [77, "../assets/weather/heavy_snow.png"], // heavy snow
    [80, "../assets/weather/light_rain.png"], // slight rain showers
    [81, "../assets/weather/dense_rain.png"], // moderate rain showers
    [82, "../assets/weather/dense_rain.png"], // violent rain showers
    [85, "../assets/weather/light_snow.png"], // snow showers
    [86, "../assets/weather/heavy_snow.png"], // heavy snow showers
    [95, "../assets/weather/light_thunder.png"], // thunderstorm
    [96, "../assets/weather/heavy_thunder.png"], // snow + thunderstorm
    [99, "../assets/weather/heavy_thunder.png"] // heavy snow + thunderstorm
  ]);
  
  // todo: create a night version