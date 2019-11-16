import {
    FETCH_WEATHER_AND_FORECAST,
    FETCH_CURRENT_WEATHER,
    SELECT_WEATHER,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    TOGGLE_THEME
} from '../actions/types';
import { mock } from '../data/mock';

// TODO - Remove mock later
const defaultState = {
    isLight: true,
    ...mock
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_WEATHER_AND_FORECAST:
        case FETCH_CURRENT_WEATHER:
        case SELECT_WEATHER:
            return {
                ...state,
                selectedWeather: action.payload
            };
        case ADD_FAVORITE:
        case DELETE_FAVORITE:
            return {
                ...state,
                favorites: action.payload
            };
        case TOGGLE_THEME:
            return {
                ...state,
                isLight: action.payload
            };
        default:
            return state;
    }
};