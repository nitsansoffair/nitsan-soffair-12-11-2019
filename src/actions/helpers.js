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
    fetchSelectedWeather: async (term, autocompleteTerms) => {
        const keysAndNames = await asyncCalls.getKeyAndName(term, autocompleteTerms);

        if(keysAndNames && keysAndNames.error){
            return keysAndNames;
        }

        let founded = keysAndNames.find(({ name }) => name.toString() === term.toString());

        if(!founded){
            founded = keysAndNames[0];
        }

        return await asyncCalls.fetchWeather(founded.key, founded.name);
    },
    fetchCurrentWeather: async (q) => {
        const { key, name } = await api.getGeoposition(q);

        return await asyncCalls.fetchWeather(key, name);
    },
    fetchAutocomplete: async(q) => {
        const cachedTerms = CacheInstance.getTerms(q);

        if(cachedTerms){
            return cachedTerms;
        }

        const fetchedTerms = await api.getAutocompleteTerms(q);

        if(validators.array(fetchedTerms)){
            CacheInstance.setTerms(q, fetchedTerms);
        }

        return fetchedTerms;
    },
    fetchWeather: async (key, name) => {
        const cachedWeather = CacheInstance.getWeather(key);

        if (cachedWeather) {
            return cachedWeather;
        }

        const [weatherData, fivedayForecast] = await Promise.all([api.getWeather(key), api.getFivedayForecast(key)]);

        if(!weatherData || !fivedayForecast){
            return errorMessages.defaultError;
        }

        const fetchedWeather = {
            key,
            ...transformer.weather(weatherData),
            name,
            fivedayForecast
        };

        CacheInstance.setWeather(key, fetchedWeather);

        return fetchedWeather;
    },
    getKeyAndName: async (term, autocompleteTerms) => {
        if (validators.array(autocompleteTerms)) {
            return autocompleteTerms;
        }

        const cachedTerms = CacheInstance.getTerms(term);

        if (cachedTerms) {
            return cachedTerms;
        }

        const apiTerms = await api.getAutocompleteTerms(term);

        if (validators.array(apiTerms)) {
            CacheInstance.setTerms(term, apiTerms);
        }

        return apiTerms;
    }
};

export default {
    calculations,
    asyncCalls,
    validators
};