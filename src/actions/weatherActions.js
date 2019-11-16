import Cache from '../cache';
import { fetchSelectedWeather, fetchCurrentWeather } from './helpers';
import {
    FETCH_WEATHER_AND_FORECAST,
    FETCH_CURRENT_WEATHER,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_WEATHER,
    TOGGLE_THEME
} from './types';

export const fetchWeatherAndForecast = (term) => async(dispatch) => {
    let selectedWeather = Cache.getWeather(term);

    if (!selectedWeather) {
        console.log('fetch weather!');
        selectedWeather = await fetchSelectedWeather(term);

        selectedWeather && Cache.setWeather(term, selectedWeather);
    }

    dispatch({
        type: FETCH_WEATHER_AND_FORECAST,
        payload: selectedWeather ? selectedWeather : {
            error: 'Error fetch selected weather.'
        }
    });
};

export const fetchWeatherByGeoposition = (q) => async(dispatch) => {
    const currentWeather = await fetchCurrentWeather(q);

    currentWeather && Cache.setWeather(currentWeather.term, currentWeather);

    dispatch({
        type: FETCH_CURRENT_WEATHER,
        payload: currentWeather ? currentWeather : {
            error: 'Error fetch current weather.'
        }
    });
};

export const selectWeather = (term) => (dispatch) => {
    const selectedWeather = Cache.getWeather(term);

    dispatch({
        type: SELECT_WEATHER,
        payload: selectedWeather
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

export const deleteFavorite = (favoriteId, favorites) => (dispatch) => {
    dispatch({
        type: DELETE_FAVORITE,
        payload: favorites.filter(({ id }) => id !== favoriteId)
    });
};

export const toggleTheme = (isLight) => (dispatch) => {
    dispatch({
        type: TOGGLE_THEME,
        payload: !isLight
    });
};