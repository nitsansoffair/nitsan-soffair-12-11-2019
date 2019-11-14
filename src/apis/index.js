import axios from 'axios';
import {
    AUTOCOMPLETE_URL,
    BASE_URL,
    CONDITIONS_URL,
    FORECAST_URL,
    STATUS_OK,
    API_KEY
} from './constants';
import transformer from "../actions/transformer";

const weather = axios.create({
    baseURL: BASE_URL
});

const getAutocomplete = async(q) => {
    try {
        const { status, data } = await weather.get(AUTOCOMPLETE_URL, {
            params: {
                // TODO - Migrate API key to process.env
                apikey: API_KEY,
                q
            }
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        // Will send the first element by default
        return transformer.autocomplete(data[0]);
    } catch (e) {
        console.log(e);
    }
};

const getWeather = async(cityKey) => {
    try {
        const { status, data } = await weather.get(`${CONDITIONS_URL}/${cityKey}`, {
            params: {
                apikey: API_KEY
            }
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        return data[0];
    } catch (e) {
        console.log(e);
    }
};

const getFivedayForecast = async(cityKey) => {
    try {
        const { status, data } = await weather.get(`${FORECAST_URL}/${cityKey}`, {
            params: {
                apikey: API_KEY
            }
        });

        if (status !== STATUS_OK){
            console.log('error');
        }

        return transformer.forecast(data);
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