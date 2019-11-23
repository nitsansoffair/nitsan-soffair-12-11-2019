import actionHelpers from './helpers';

const weather = ({ WeatherText, Temperature: { Metric: { Value } } }) => ({
    weatherText: WeatherText,
    temperatureValue: Math.round(Value)
}),
    forecast = ({ Headline: { Text }, DailyForecasts }) => {
        const daysWeather = DailyForecasts.map(({ Date, Temperature: { Minimum, Maximum } }) => ({
            day: actionHelpers.calculations.getDay(Date),
            temperature: Math.round(actionHelpers.calculations.toCelsius(actionHelpers.calculations.mean(Minimum.Value, Maximum.Value))),
        }));

        return {
            headline: Text,
            daysWeather
        };
},
    geoPositionParams = ({ latitude, longitude }) => `${latitude},${longitude}`;

export default {
    weather,
    forecast,
    geoPositionParams
};