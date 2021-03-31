import { createAction, props } from "@ngrx/store";
import { IAppState, LanguageEnum, TemperatureEnum, TimeEnum, WindSpeedEnum } from "../models/state.model";


export const setSettigns = createAction(
    '[State] SET_SETTINGS',
    props<{ payload: IAppState }>()
)

export const setTemperature = createAction(
    '[State] SET_TEMPERATURE',
    props<{ payload: TemperatureEnum }>()
);

export const setWindSpeed = createAction(
    '[State] SET_WIND_SPEED',
    props<{ payload: WindSpeedEnum }>()
);

export const setTime = createAction(
    '[State] SET_TIME',
    props<{ payload: TimeEnum }>()
);

export const setLanguage = createAction(
    '[State] SET_LANGUAGE',
    props<{ payload: LanguageEnum }>()
);

export const refreshLocation = createAction(
    '[Weather] REFRESH_LOCATION'
);