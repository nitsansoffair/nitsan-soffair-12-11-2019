export const transformWeather = (weather) => {
    const { WeatherText, Temperature: { Metric: { Value } } } = weather;

    return {
        WeatherText,
        temperatureValue: Value
    };
};