import api from '../apis';
import { transformWeather } from './transformer';
import {
    FETCH_AUTOCOMPLETE,
    FETCH_WEATHER,
    FETCH_FORECAST,
    ADD_FAVORITE,
    DELETE_FAVORITE,
    SELECT_CITY
} from './types';

// async actions
export const getAutocomplete = (term) => async(dispatch) => {
    const { key } = await api.getAutocomplete(term);

    dispatch({
        type: FETCH_AUTOCOMPLETE,
        payload: key
    });
};

export const getWeather = (cityKey) => async(dispatch) => {
    const weather = await api.getWeather(cityKey);

    dispatch({
        type: FETCH_WEATHER,
        payload: transformWeather(weather)
    });
};

export const getFivedayForecast = (cityKey) => async(dispatch) => {
    const fivedayForecast = await api.getFivedayForecast(cityKey);

    dispatch({
        type: FETCH_FORECAST,
        payload: fivedayForecast
    });
};

// sync actions
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