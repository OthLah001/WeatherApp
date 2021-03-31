import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import { Actions } from ".";
import { IAppState, LanguageEnum, TemperatureEnum, TimeEnum, WindSpeedEnum } from "../models/state.model";


export const INIT_APP_STATE: IAppState = {
    temperature: TemperatureEnum.Celsius,
    windSpeed: WindSpeedEnum.MeterPerSec,
    time: TimeEnum.TwentyFourHours,
    language: LanguageEnum.English
}

const temperatureReducer = createReducer(
    INIT_APP_STATE.temperature,
    on(Actions.setTemperature, (state, { payload: temperature }) => temperature)
);
export function temperatureReducerFn(state, action) {
    return temperatureReducer(state, action);
}

const windSpeedReducer = createReducer(
    INIT_APP_STATE.windSpeed,
    on(Actions.setWindSpeed, (state, { payload: windSpeed }) => windSpeed)
);
export function windSpeedReducerFn(state, action) {
    return windSpeedReducer(state, action);
}

const timeReducer = createReducer(
    INIT_APP_STATE.time,
    on(Actions.setTime, (state, { payload: time }) => time)
);
export function timeReducerFn(state, action) {
    return timeReducer(state, action);
}

const languageReducer = createReducer(
    INIT_APP_STATE.language,
    on(Actions.setLanguage, (state, { payload: language }) => language)
);
export function languageReducerFn(state, action) {
    return languageReducer(state, action);
}


export const AppReducers: ActionReducerMap<any> = {
    temperature: temperatureReducerFn,
    windSpeed: windSpeedReducerFn,
    time: timeReducerFn,
    language: languageReducerFn
};