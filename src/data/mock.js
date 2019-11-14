export const mock = {
    selectedWeather: {
        key: 215854,
        name: "Tel Aviv",
        weatherText: "Clear",
        temperatureValue: 26.8,
        isFavorite: true,
        fivedayForecast: {
            headline: "Pleasant Sunday",
            daysWeather: [
                {
                    day: "Thursday",
                    temperature: 26
                },
                {
                    day: "Friday",
                    temperature: 22
                },
                {
                    day: "Saturday",
                    temperature: 20
                },
                {
                    day: "Sunday",
                    temperature: 21
                },
                {
                    day: "Monday",
                    temperature: 20
                }
            ]
        }
    },
    favorites: [
        {
            id: 215854,
            name: "Tel Aviv",
            currentWeather: {
                weatherText: "Pleasant Sunday",
                temperatureValue: 26
            }
        },
        {
            id: 215752,
            name: "Beersheba",
            currentWeather: {
                weatherText: "Mostly clear",
                temperatureValue: 22
            }
        },
        {
            id: 215849,
            name: "Ramat Gan",
            currentWeather: {
                weatherText: "Clear",
                temperatureValue: 24
            }
        },
        {
            id: 213181,
            name: "Haifa",
            currentWeather: {
                weatherText: "Clear",
                temperatureValue: 24
            }
        },
        {
            id: 213225,
            name: "Jerusalem",
            currentWeather: {
                weatherText: "Clear",
                temperatureValue: 22
            }
        },
    ]
};