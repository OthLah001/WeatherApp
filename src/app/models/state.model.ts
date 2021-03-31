
export interface IAppState {
    temperature: TemperatureEnum;
    windSpeed: WindSpeedEnum;
    time: TimeEnum;
    language: LanguageEnum;
}

export enum TemperatureEnum {
    Celsius = 'C',
    Fahrenheit = 'F',
    Kelvin = 'K'
}

export enum WindSpeedEnum {
    MeterPerSec = 'm/s',
    MilesPerHour = 'm/h'
}

export enum TimeEnum {
    TwentyFourHours = '24h',
    TwelveHours = '12h'
}

export enum LanguageEnum {
    English = 'en',
    French = 'fr',
    Arabic = 'ar'
}