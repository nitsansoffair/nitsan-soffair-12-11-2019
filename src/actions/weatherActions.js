import api from '../apis';
import CacheInstance from '../cache';
import actionHelpers from './helpers';
import {
    FETCH_WEATHER_AND_FORECAST,
    FETCH_CURRENT_WEATHER,
    FETCH_AUTOCOMPLETE_TERMS,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_WEATHER,
} from './types';

export const fetchWeatherAndForecast = (term, autocompleteTerms) => async(dispatch) => {
    let selectedWeather = CacheInstance.getWeather(term);

    if (!selectedWeather) {
        selectedWeather = await actionHelpers.asyncCalls.fetchSelectedWeather(term, autocompleteTerms);
    }

    const weather = actionHelpers.handlers.weather(selectedWeather, 'fetchWeatherAndForecast');

    dispatch({
        type: FETCH_WEATHER_AND_FORECAST,
        payload: weather
    });
},
    fetchWeatherByGeoposition = (q) => async(dispatch) => {
        let currentWeather = await actionHelpers.asyncCalls.fetchCurrentWeather(q);
        const weather = actionHelpers.handlers.weather(currentWeather, 'fetchWeatherByGeoposition');

        dispatch({
            type: FETCH_CURRENT_WEATHER,
            payload: weather
        });
},
    getAutocompleteTerms = (term) => async(dispatch) => {
        let autocompleteTerms = CacheInstance.getTerms(term);

        if(!autocompleteTerms){
            autocompleteTerms = await api.getAutocompleteTerms(term);
        }

        autocompleteTerms = actionHelpers.handlers.autocomplete(term, autocompleteTerms);
        dispatch({
            type: FETCH_AUTOCOMPLETE_TERMS,
            payload: autocompleteTerms
        });
    },
    selectWeather = (term) => (dispatch) => {
        dispatch({
            type: SELECT_WEATHER,
            payload: CacheInstance.getWeather(term)
        });
},
    addFavorite = (favorite) => (dispatch, getState) => {
        const { weather: { favorites = [] } } = getState();

        dispatch({
            type: ADD_FAVORITE,
            payload: [
                ...favorites,
                favorite
            ]
        });
},
    deleteFavorite = (favoriteId) => (dispatch, getState) => {
        const { weather: { favorites = [] } } = getState();

        dispatch({
            type: DELETE_FAVORITE,
            payload: favorites.filter(({ id }) => id !== favoriteId)
        });
};