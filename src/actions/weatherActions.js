import CacheInstance from '../cache';
import actionHelpers from './helpers';
import {
    FETCH_WEATHER_AND_FORECAST,
    FETCH_CURRENT_WEATHER,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_WEATHER,
    TOGGLE_THEME,
    TOGGLE_TEMPERATURE
} from './types';
import errorMessages from '../data/errorMessages';

export const fetchWeatherAndForecast = (term) => async(dispatch) => {
    let selectedWeather = CacheInstance.getWeather(term);

    if (!selectedWeather) {
        selectedWeather = await actionHelpers.fetchSelectedWeather(term);

        selectedWeather && !CacheInstance.setWeather(term, selectedWeather) && console.log(errorMessages.cache.setError('fetchWeatherAndForecast'));
    }

    dispatch({
        type: FETCH_WEATHER_AND_FORECAST,
        payload: selectedWeather
    });
};

export const fetchWeatherByGeoposition = (q) => async(dispatch) => {
    const currentWeather = await actionHelpers.fetchCurrentWeather(q);

    currentWeather && !CacheInstance.setWeather(currentWeather.term, currentWeather) && console.log(errorMessages.cache.setError('fetchWeatherByGeoposition'));

    dispatch({
        type: FETCH_CURRENT_WEATHER,
        payload: currentWeather
    });
};

export const selectWeather = (term) => (dispatch) => {
    dispatch({
        type: SELECT_WEATHER,
        payload: CacheInstance.getWeather(term)
    });
};

export const addFavorite = (favorite) => (dispatch, getState) => {
    const { favorites = [] } = getState();

    dispatch({
        type: ADD_FAVORITE,
        payload: [
            ...favorites,
            favorite
        ]
    });
};

export const deleteFavorite = (favoriteId) => (dispatch, getState) => {
    const { favorites = [] } = getState();

    dispatch({
        type: DELETE_FAVORITE,
        payload: favorites.filter(({ id }) => id !== favoriteId)
    });
};

export const toggleTheme = () => (dispatch, getState) => {
    const { isLight } = getState();

    dispatch({
        type: TOGGLE_THEME,
        payload: !isLight
    });
};

export const toggleTemperature = () => (dispatch, getState) => {
    const { isCelsius } = getState();

    dispatch({
        type: TOGGLE_TEMPERATURE,
        payload: !isCelsius
    });
};