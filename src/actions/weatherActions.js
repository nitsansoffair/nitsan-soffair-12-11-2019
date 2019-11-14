import api from '../apis';
import transformer from './transformer';
import {
    FETCH_WEATHER_AND_FORECAST,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_CITY
} from './types';

// Async actions
export const fetchWeatherAndForecast = (term) => async(dispatch) => {
    try {
        const { Key, LocalizedName } = await api.getAutocomplete(term);
        const weatherData = await api.getWeather(Key);
        const fivedayForecast = await api.getFivedayForecast(Key);

        dispatch({
            type: FETCH_WEATHER_AND_FORECAST,
            payload: {
                ...transformer.weather(weatherData),
                LocalizedName,
                fivedayForecast
            }
        });
    } catch (e) {
        console.log(e);
    }
};

// Sync actions
export const selectCity = (cityKey) => (dispatch) => {
    dispatch({
        type: SELECT_CITY,
        payload: cityKey
    });
};

export const addFavorite = (favorite) => (dispatch, getState) => {
    const { favorites } = getState();

    dispatch({
        type: ADD_FAVORITE,
        payload: [
            ...favorites,
            favorite
        ]
    });
};

export const deleteFavorite = (favoriteId) => (dispatch, getState) => {
    const { favorites } = getState();

    dispatch({
        type: DELETE_FAVORITE,
        payload: favorites.filter(({ id }) => id !== favoriteId)
    });
};