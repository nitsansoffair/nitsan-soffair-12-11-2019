import translations from '../../data/translations';

const toFahrenheit = (celsius) => (celsius * 9/5) + 32;

const isFavorite = (selectedWeather, favorites = []) => selectedWeather && favorites.find(({ id }) => id === selectedWeather.key);

const getFavoritesClasses = ({ isFavoriteWeather, isLight }) => [
    isFavoriteWeather ? "fas fa-heart" : "far fa-heart",
    isLight ? "simpleButton light" : "simpleButton dark"
];

const getHeaderClasses = (isLight) => [
    isLight ? "item light" : "item dark",
    isLight ? "toggleButton light" : "toggleButton dark"
];

const getContainerClass = (isLight) => isLight ? "pageContainer lightContainer" : "pageContainer darkContainer";

const getCardClass = (isLight) => isLight ? "cardItem" : "cardItem dark";

const getTemperatureChar = (isCelsius) => isCelsius ? translations.main.celsiusChar : translations.main.fahrenheitChar;

const getTemperature = (isCelsius, temperatureValue) => isCelsius ? temperatureValue : componentsHelpers.toFahrenheit(temperatureValue);

const validateInput = (term) => /^[a-zA-Z\s]+$/.test(term);

const getThemeButtonText = (isLight) => isLight ? translations.header.themeButtonDark : translations.header.themeButtonLight;

const getTemperatureButtonText = (isCelsius) => isCelsius ? translations.header.temperatureButtonFahrenheit : translations.header.temperatureButtonCelsius;

const componentsHelpers = {
    toFahrenheit,
    isFavorite,
    getFavoritesClasses,
    getHeaderClasses,
    getContainerClass,
    getCardClass,
    getTemperatureChar,
    getTemperature,
    validateInput,
    getThemeButtonText,
    getTemperatureButtonText
};

export default componentsHelpers;