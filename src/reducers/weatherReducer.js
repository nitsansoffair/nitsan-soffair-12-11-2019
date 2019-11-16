import {
    FETCH_WEATHER_AND_FORECAST,
    SELECT_WEATHER,
    ADD_FAVORITE,
    DELETE_FAVORITE, FETCH_CURRENT_WEATHER,
} from '../actions/types';

export default (state = {}, action) => {
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
        default:
            return state;
    }
};