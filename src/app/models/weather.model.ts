export class HeaderWeather {
    city: string = null;
    dateTime: Date = null;
}

export class CurrentWeather {
    description: string = null;
    temp: number = null;
    humidity: number = null;
    windSpeed: number = null;
    windDeg: number = null;
}

export class HourlyWeather {
    time: Date = null;
    description: string = null;
    temp: number = null;
    iconLetter: string = null;
}
export type THourlyWeather = HourlyWeather[];

export class DailyWeather {
    day: Date = null;
    description: string = null;
    tempMax: number = null;
    tempMin: number = null;
    sunrise: Date = null;
    sunset: Date = null;
}
export type TDailyWeather = DailyWeather[];

const WeatherDescription = {
    thunderstorm: ['thunderstorm', 'thunderstorm with light rain', 'thunderstorm with rain', 'thunderstorm with heavy rain',
        'light thunderstorm', 'heavy thunderstorm', 'ragged thunderstorm', 'thunderstorm with light drizzle', 'thunderstorm with drizzle',
        'thunderstorm with heavy drizzle'],
    rain: ['rain', 'light rain', 'moderate rain', 'heavy intensity rain', 'very heavy rain', 'very heavy rain'],
    showerRain: ['shower rain', 'light intensity shower rain', 'heavy intensity shower rain', 'ragged shower rain',
        'light intensity drizzle', 'drizzle', 'heavy intensity drizzle', 'light intensity drizzle rain', 'drizzle rain',
        'heavy intensity drizzle rain', 'shower rain and drizzle', 'heavy shower rain and drizzle', 'shower drizzle'],
    snow: ['snow', 'light snow', 'Snow', 'Heavy snow', 'Sleet', 'Light shower sleet', 'Shower sleet', 'Light rain and snow',
        'Rain and snow', 'Light shower snow', 'Shower snow', 'Heavy shower snow', 'freezing rain'],
    mist: ['mist', 'Smoke', 'Haze', 'sand/ dust whirls', 'fog', 'sand', 'dust', 'volcanic ash', 'squalls', 'tornade'],
    brokenClouds: ['broken clouds', 'overcast clouds']
};

export const decideDescription = (description, iconLetter = null, isMorning = null) => {
    if (description === 'clear sky' || description === 'few clouds') {
        return description + (isMorning || iconLetter === 'd' ? ' morning' : ' night');
    }

    if (description === 'few clouds' || description === 'scattered clouds') {
        return description;
    }

    for (const key of Object.keys(WeatherDescription)) {
        if (WeatherDescription[key].includes(description)) {
            return WeatherDescription[key][0];
        }
    }

    return description;
};
