import api from '../apis';
import transformer from './transformer';
import { days } from '../data/days';

export const mean = (n1, n2) => (n1 + n2) / 2;

export const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;

export const getDay = (string) => days[new Date(string).getDay()];

export const fetchSelectedWeather = async(term) => {
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
        console.log(e);

        return null;
    }
};