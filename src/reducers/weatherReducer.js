import {
    FETCH_WEATHER_AND_FORECAST,
    FETCH_CURRENT_WEATHER,
    FETCH_AUTOCOMPLETE_TERMS,
    SELECT_WEATHER,
    ADD_FAVORITE,
    DELETE_FAVORITE
} from '../actions/types';

const defaultState = {};

export default (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_WEATHER_AND_FORECAST:
        case FETCH_CURRENT_WEATHER:
        case SELECT_WEATHER:
            return {
                ...state,
                selectedWeather: action.payload
            };
        case FETCH_AUTOCOMPLETE_TERMS:
            return {
                ...state,
                autocompleteTerms: action.payload
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