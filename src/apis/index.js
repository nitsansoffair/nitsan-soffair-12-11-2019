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
import CacheInstance from "../cache";

const defaultParams = {
    apikey: process.env.REACT_APP_API_KEY,
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    validateStatus: (status => status === STATUS_OK)
};

const weather = axios.create(defaultParams),
    getAutocompleteTerms = async(q) => {
        try {
            const { data } = await weather.get(AUTOCOMPLETE_URL, {
                params: {
                    ...defaultParams,
                    q
                }
            });

            return data.map(({ LocalizedName, Key }) => ({
                key: Key,
                name: LocalizedName
            }));
        } catch (e) {
            console.log(errorMessages.api.asyncCall(e, 'getAutocompleteTerms'));

            return errorMessages.defaultError;
        }
    },
    getGeoposition = async(q) => {
        try {
            const cachedTerms = CacheInstance.getTermsByCoords(q);

            if(cachedTerms){
                return cachedTerms;
            }

            const { data: { Key, LocalizedName } } = await weather.get(GEOPOSITION_URL, {
                params: {
                    ...defaultParams,
                    q
                }
            });

            const fetchedTerms = {
                key: Key,
                name: LocalizedName
            };

            CacheInstance.setTermsWithCoords(q, fetchedTerms);

            return fetchedTerms;
        } catch (e) {
            console.log(errorMessages.api.asyncCall(e, 'getGeoposition'));

            return errorMessages.defaultError;
        }
},
    getWeather = async(cityKey) => {
        try {
            const { data } = await weather.get(`${CONDITIONS_URL}/${cityKey}`, {
                params: defaultParams
            });

            return data[0];
        } catch (e) {
            console.log(errorMessages.api.asyncCall(e, 'getWeather'));

            return null;
        }
    },
    getFivedayForecast = async(cityKey) => {
        try {
            const { data } = await weather.get(`${FORECAST_URL}/${cityKey}`, {
                params: defaultParams
            });

            return transformer.forecast(data);
        } catch (e) {
            console.log(errorMessages.api.asyncCall(e, 'getFivedayForecast'));

            return null;
        }
    };

export default {
    getAutocompleteTerms,
    getGeoposition,
    getWeather,
    getFivedayForecast
};