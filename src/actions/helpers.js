import api from '../apis';
import CacheInstance from '../cache';
import transformer from './transformer';
import { days } from '../data/days';
import errorMessages from '../data/errorMessages';

const calculations = {
    mean: (n1, n2) => (n1 + n2) / 2,
    toCelsius: (fahrenheit) => (fahrenheit - 32) * 5/9,
    getDay: (string) => days[new Date(string).getDay()]
};

const validators = {
    array: (array) => Array.isArray(array) && array.length
};

const asyncCalls = {
    fetchSelectedWeather: async(term) => {
        try {
            // TODO - Add cache fetch for key here
            const { Key, LocalizedName } = await api.getAutocompleteTerm(term);
            const [weatherData, fivedayForecast] = await Promise.all([api.getWeather(Key) ,api.getFivedayForecast(Key)]);

            return {
                key: Key,
                term,
                ...transformer.weather(weatherData),
                name: LocalizedName,
                fivedayForecast
            };
        } catch (e) {
            console.log(errorMessages.api.fetch_weather('fetchSelectedWeather'));

            return null;
        }
    },
    fetchCurrentWeather: async(q) => {
        try {
            const { Key, LocalizedName } = await api.getGeoposition(q);
            const [weatherData, fivedayForecast] = await Promise.all([api.getWeather(Key) ,api.getFivedayForecast(Key)]);

            return {
                key: Key,
                term: LocalizedName,
                ...transformer.weather(weatherData),
                name: LocalizedName,
                fivedayForecast
            };
        } catch (e) {
            console.log(errorMessages.api.fetch_geoposition('fetchCurrentWeather'));

            return null;
        }
    }
};

const handlers = {
    weather: (weatherParam, errLocation) => {
        let weather = weatherParam;

        if(!weather){
            console.log(errorMessages.cache.setError(errLocation));

            weather = {
                error: errorMessages.api.internalServerError
            };
        } else {
            CacheInstance.setWeather(weather.term, weather);
        }

        return weather;
    },
    autocomplete: (term, autocompleteTerms) => {
        if(autocompleteTerms){
            CacheInstance.setTerms(term, autocompleteTerms);
        } else {
            console.log(errorMessages.api.asyncCall('Error empty autocomplete term', 'getAutocompleteTerm'));

            autocompleteTerms = {
                error: errorMessages.api.internalServerError
            };
        }

        return autocompleteTerms;
    }
};

export default {
    calculations,
    asyncCalls,
    validators,
    handlers
};