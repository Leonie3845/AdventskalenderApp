import {Injectable} from '@angular/core';

import {fetchWeatherApi} from 'openmeteo';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  async getSnowPredicionForLocation(longitude: number, latitude: number, date: string): Promise<any> {
    const params = {
      "latitude": latitude,
      "longitude": longitude,
      "daily": ["temperature_2m_max", "sunshine_duration", "snowfall_sum", "rain_sum", "precipitation_sum"],
      "hourly": ["snowfall", "snow_depth", "rain", "precipitation_probability", "temperature_2m"],
      "start_date": date,
      "end_date": date,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

// Attributes for timezone and location
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${latitude}°N ${longitude}°E`,
      `\nElevation: ${elevation}m asl`,
      `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const hourly = response.hourly()!;
    const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: Array.from(
          {length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()},
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        snowfall: hourly.variables(0)!.valuesArray(),
        snow_depth: hourly.variables(1)!.valuesArray(),
        rain: hourly.variables(2)!.valuesArray(),
        precipitation_probability: hourly.variables(3)!.valuesArray(),
        temperature_2m: hourly.variables(4)!.valuesArray(),
      },
      daily: {
        time: Array.from(
          {length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()},
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature_2m_max: daily.variables(0)!.valuesArray(),
        sunshine_duration: daily.variables(1)!.valuesArray(),
        snowfall_sum: daily.variables(2)!.valuesArray(),
        rain_sum: daily.variables(3)!.valuesArray(),
        precipitation_sum: daily.variables(4)!.valuesArray(),
      },
    };

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
    console.log("\nHourly data", weatherData.hourly)
    console.log("\nDaily data", weatherData.daily)
    return weatherData;


  }
}


