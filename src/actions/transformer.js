import { mean, toCelsius, getDay } from '../helpers';

const weather = ({ WeatherText, Temperature: { Metric: { Value } } }) => ({
    weatherText: WeatherText,
    temperatureValue: Math.round(Value)
});

const autocomplete = ({ Key, LocalizedName }) => ({
    Key,
    LocalizedName
});

const forecast = ({ Headline: { Text }, DailyForecasts }) => {
    const daysWeather = DailyForecasts.map(({ Date, Temperature: { Minimum, Maximum } }) => ({
        day: getDay(Date),
        temperature: Math.round(toCelsius(mean(Minimum.Value, Maximum.Value))),
    }));

    return {
        headline: Text,
        daysWeather
    };
};

const transformer = {
    weather,
    autocomplete,
    forecast
};

export default transformer;