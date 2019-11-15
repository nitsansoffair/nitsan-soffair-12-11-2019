import Cache from '../cache';
import { fetchSelectedWeather } from './helpers';
import {
    FETCH_WEATHER_AND_FORECAST,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_WEATHER
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