import actionHelpers from './helpers';

const weather = ({ WeatherText, Temperature: { Metric: { Value } } }) => ({
    weatherText: WeatherText,
    temperatureValue: Math.round(Value)
});

const keyAndCity = ({ Key, LocalizedName }) => ({
    Key,
    LocalizedName
});

const forecast = ({ Headline: { Text }, DailyForecasts }) => {
    const daysWeather = DailyForecasts.map(({ Date, Temperature: { Minimum, Maximum } }) => ({
        day: actionHelpers.getDay(Date),
        temperature: Math.round(actionHelpers.toCelsius(actionHelpers.mean(Minimum.Value, Maximum.Value))),
    }));

    return {
        headline: Text,
        daysWeather
    };
};

const geoPositionParams = ({ latitude, longitude }) => `${latitude},${longitude}`;

const transformer = {
    weather,
    keyAndCity,
    forecast,
    geoPositionParams
};

export default transformer;