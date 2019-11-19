import axios from 'axios';
import transformer from '../actions/transformer';
import errorMessages from '../data/errorMessages';
import {
    BASE_URL,
    AUTOCOMPLETE_URL,
    GEOPOSITION_URL,
    CONDITIONS_URL,
    FORECAST_URL,
    API_KEY,
    STATUS_OK,
    TIME_OUT
} from './constants';

const weather = axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    validateStatus: (status => status === STATUS_OK)
});

const getAutocomplete = async(q) => {
    try {
        const { data } = await weather.get(AUTOCOMPLETE_URL, {
            transformResponse: (data, headers) => transformer.keyAndCity(JSON.parse(data)[0]),
            params: {
                apikey: API_KEY, // TODO - Migrate API key to process.env
                q
            }
        });

        return data;
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getAutocomplete'));
    }
};

const getGeoposition = async(q) => {
    try {
        const { data } = await weather.get(GEOPOSITION_URL, {
            transformResponse: (data, headers) => transformer.keyAndCity(JSON.parse(data)),
            params: {
                apikey: API_KEY,
                q
            }
        });

        return data;
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getGeoposition'));
    }
};

const getWeather = async(cityKey) => {
    try {
        const { data } = await weather.get(`${CONDITIONS_URL}/${cityKey}`, {
            params: {
                apikey: API_KEY
            }
        });

        return data[0];
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getWeather'));
    }
};

const getFivedayForecast = async(cityKey) => {
    try {
        const { data } = await weather.get(`${FORECAST_URL}/${cityKey}`, {
            transformResponse: (data, headers) => transformer.forecast(JSON.parse(data)),
            params: {
                apikey: API_KEY
            }
        });

        return data;
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getFivedayForecast'));
    }
};

const api = {
    getAutocomplete,
    getGeoposition,
    getWeather,
    getFivedayForecast
};

export default api;