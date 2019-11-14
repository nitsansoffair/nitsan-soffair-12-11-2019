import { mean, toCelsius } from '../helpers';

const weather = ({ WeatherText, Temperature: { Metric: { Value } } }) => ({
    WeatherText,
    temperatureValue: Value
});

const autocomplete = ({ Key, LocalizedName }) => ({
    Key,
    LocalizedName
});

const forecast = ({ Headline: { Text }, DailyForecasts }) => {
    const daysWeather = DailyForecasts.map(({Date, Temperature: {Minimum, Maximum}, Day: {IconPhrase}}) => ({
        Date,
        Temperature: Math.round(toCelsius(mean(Minimum.Value, Maximum.Value))),
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