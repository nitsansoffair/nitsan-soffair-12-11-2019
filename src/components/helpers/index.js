import translations from '../../data/translations';

const styling = {
    getContainerClass: (isLight) => isLight ? "pageContainer" : "pageContainer darkContainer",
    getErrorToastClass: (isLight) => isLight ? "errorToast" : "errorToast darkErrorToast",
    getFavoritesClasses: ({ isFavoriteWeather, isLight }) => [
        isFavoriteWeather ? "fas fa-heart" : "far fa-heart",
        isLight ? "favoritesButton lightFavoritesButton" : "favoritesButton darkFavoritesButton"
    ],
    getHeaderClasses: (isLight) => [
        isLight ? "linkItem lightLinkItem" : "linkItem darkLinkItem",
        isLight ? "toggleButton lightToggleButton" : "toggleButton darkToggleButton"
    ]
},
    text = {
    getTemperatureChar: (isCelsius) => isCelsius ? translations.main.celsiusChar : translations.main.fahrenheitChar,
    getThemeButtonText: (isLight) => isLight ? translations.header.themeButtonDark : translations.header.themeButtonLight,
    getTemperatureButtonText: (isCelsius) => isCelsius ? translations.header.temperatureButtonFahrenheit : translations.header.temperatureButtonCelsius
},
    calculations = {
    toFahrenheit: (celsius) => (celsius * 9/5) + 32,
    isFavorite: (selectedWeather, favorites = []) => selectedWeather && favorites.find(({ id }) => id === selectedWeather.key)
},
    others = {
    getTemperature: (isCelsius, temperatureValue) => isCelsius ? temperatureValue : calculations.toFahrenheit(temperatureValue),
    validateInput: (term) => /^[a-zA-Z\s]+$/.test(term)
};

export default {
    styling,
    text,
    calculations,
    others
};