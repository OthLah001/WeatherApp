import { IAppState } from "../models/state.model";


export const selectSettings= (state: IAppState) => state;

export const selectTemperature = (state: IAppState) => state.temperature;

export const selectWindSpeed = (state: IAppState) => state.windSpeed;

export const selectTime = (state: IAppState) => state.time;

export const selectLanguage = (state: IAppState) => state.language;