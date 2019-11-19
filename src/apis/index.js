import axios from 'axios';
import transformer from '../actions/transformer';
import errorMessages from '../data/errorMessages';
import {
    BASE_URL,
    AUTOCOMPLETE_URL,
    GEOPOSITION_URL,
    CONDITIONS_URL,
    FORECAST_URL,
    STATUS_OK,
    TIME_OUT
} from './constants';

const defaultParams = {
    apikey: process.env.REACT_APP_API_KEY,
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    validateStatus: (status => status === STATUS_OK)
};

// TODO - Validate api correctness
const weather = axios.create(defaultParams),
    getAutocompleteTerm = async(q) => {
    try {
        const { data } = await weather.get(AUTOCOMPLETE_URL, {
            params: {
                ...defaultParams,
                q
            }
        });

        return transformer.keyAndCity(JSON.parse(data)[0]);
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getAutocomplete'));

        return null;
    }
},
    getAutocompleteTerms = async(q) => {
        try {
            const { data } = await weather.get(AUTOCOMPLETE_URL, {
                params: {
                    ...defaultParams,
                    q
                }
            });

            return data.map(({ LocalizedName }) => LocalizedName);
        } catch (e) {
            console.log(errorMessages.api.asyncCall(e, 'getAutocompleteTerms'));

            return null;
        }
    },
    getGeoposition = async(q) => {
    try {
        const { data } = await weather.get(GEOPOSITION_URL, {
            params: {
                ...defaultParams,
                q
            }
        });

        return transformer.keyAndCity(data);
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getGeoposition'));

        return null;
    }
},
    getWeather = async(cityKey) => {
    try {
        const { data } = await weather.get(`${CONDITIONS_URL}/${cityKey}`);

        return data[0];
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getWeather'));

        return null;
    }
},
    getFivedayForecast = async(cityKey) => {
    try {
        const { data } = await weather.get(`${FORECAST_URL}/${cityKey}`);

        return transformer.forecast(JSON.parse(data));
    } catch (e) {
        console.log(errorMessages.api.asyncCall(e, 'getFivedayForecast'));

        return null;
    }
};

export default {
    getAutocompleteTerm,
    getAutocompleteTerms,
    getGeoposition,
    getWeather,
    getFivedayForecast
};