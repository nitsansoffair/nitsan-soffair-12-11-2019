import api from '../apis';
import CacheInstance from '../cache';
import transformer from './transformer';
import componentHelpers from '../components/helpers';
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
    getKeyAndName: async(term, autocompleteTerms) => {
        if(validators.array(autocompleteTerms)){
            console.log('got terms from store!');
            return autocompleteTerms[0];
        }

        const cachedTerms = CacheInstance.getTerms(term);

        if(cachedTerms){
            console.log('got terms from cache!');
            return cachedTerms[0];
        }

        const apiTerms = await api.getAutocompleteTerms(term);

        if(apiTerms){
            CacheInstance.setTerms(term, apiTerms);
            console.log(apiTerms, 'set terms at cache!');

            return apiTerms[0];
        }

        throw Error(errorMessages.other.getError('getKeyAndName'));
    },
    fetchSelectedWeather: async(term, autocompleteTerms) => {
        try {
            const { key, name } = await asyncCalls.getKeyAndName(term, autocompleteTerms);
            const [weatherData, fivedayForecast] = await Promise.all([api.getWeather(key) ,api.getFivedayForecast(key)]);

            return {
                key,
                term,
                ...transformer.weather(weatherData),
                name,
                fivedayForecast
            };
        } catch (e) {
            console.log(errorMessages.api.fetchWeather('fetchSelectedWeather'));

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
            console.log(errorMessages.api.fetchGeoposition('fetchCurrentWeather'));

            return null;
        }
    }
};

const handlers = {
    weather: (weatherParam, errLocation) => {
        let weather = weatherParam;

        if(!weather){
            console.log(errorMessages.other.setError(errLocation));

            weather = {
                error: errorMessages.other.internalServerError
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
                error: errorMessages.other.internalServerError
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