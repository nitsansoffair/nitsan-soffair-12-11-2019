import api from '../apis';
import transformer from './transformer';
import { days } from '../data/days';
import errorMessages from '../data/errorMessages';

const mean = (n1, n2) => (n1 + n2) / 2;

const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;

const getDay = (string) => days[new Date(string).getDay()];

const fetchSelectedWeather = async(term) => {
    try {
        const { Key, LocalizedName } = await api.getAutocomplete(term);
        const [weatherData, fivedayForecast] = await Promise.all([api.getWeather(Key) ,api.getFivedayForecast(Key)]);

        return {
            key: Key,
            term,
            ...transformer.weather(weatherData),
            name: LocalizedName,
            fivedayForecast
        };
    } catch (e) {
        return {
            error: errorMessages.api.fetch_weather('fetchSelectedWeather')
        };
    }
};

const fetchCurrentWeather = async(q) => {
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
        return {
            error: errorMessages.api.fetch_geoposition('fetchCurrentWeather')
        };
    }
};

const actionHelpers = {
    mean,
    toCelsius,
    getDay,
    fetchSelectedWeather,
    fetchCurrentWeather
};

export default actionHelpers;