import {
    FETCH_AUTOCOMPLETE,
    FETCH_FORECAST,
    FETCH_WEATHER,
    SELECT_CITY,
    ADD_FAVORITE,
    DELETE_FAVORITE,
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_AUTOCOMPLETE:
            return {
                ...state,
                selectedCity: action.payload
            };
        case FETCH_WEATHER:
            return {
                ...state,
                selectedWeather: action.payload
            };
        case FETCH_FORECAST:
            return {
                ...state,
                fivedayForecast: action.payload
            };
        case SELECT_CITY:
            return {
                ...state,
                selectedCity: action.payload
            };
        case ADD_FAVORITE:
        case DELETE_FAVORITE:
            return {
                ...state,
                favorites: action.payload
            };
        default:
            return state;
    }
};