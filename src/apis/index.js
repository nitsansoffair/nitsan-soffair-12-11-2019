import axios from 'axios';
import {
    AUTOCOMPLETE_URL,
    BASE_URL,
    CONDITIONS_URL,
    FORECAST_URL,
    STATUS_OK
} from './constants';

const weather = axios.create({
    baseURL: BASE_URL
});

const getAutocomplete = async(q) => {
    try {
        const { status, data } = await weather.get(AUTOCOMPLETE_URL, {
            apikey: process.env.REACT_APP_API_KEY,
            q
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
};

const getWeather = async(cityKey) => {
    try {
        const { status, data } = await weather.get(`${CONDITIONS_URL}/${cityKey}`, {
            apikey: process.env.REACT_APP_API_KEY
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
};

const getFivedayForecast = async(cityKey) => {
    try {
        const { status, data } = await weather.get(`${FORECAST_URL}/${cityKey}`, {
            apikey: process.env.REACT_APP_API_KEY
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
};

const api = {
    getAutocomplete,
    getWeather,
    getFivedayForecast
};

export default api;