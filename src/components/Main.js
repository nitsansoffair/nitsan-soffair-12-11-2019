import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, fetchWeatherByGeoposition, addFavorite, deleteFavorite } from '../actions/weatherActions';
import { togglePage } from '../actions/appActions';
import transformer from '../actions/transformer';
import componentsHelpers from './helpers';
import translations from '../data/translations';
import '../style/index.scss';

class Main extends Component {
    state = {
        term: translations.main.defaultTerm
    };

    componentDidMount() {
        const { isFirstLoad, onFirstLoad, togglePage, isMainPage } = this.props;

        if(isFirstLoad){
            this.fetchGeolocation();

            onFirstLoad();
        }

        !isMainPage && togglePage();
    }

    fetchGeolocation(){
        const { fetchWeatherByGeoposition } = this.props;

        navigator.geolocation.getCurrentPosition(({ coords }) => {
            fetchWeatherByGeoposition(transformer.geoPositionParams(coords));
        });
    }

    onFavoritesClick = () => {
        const { selectedWeather, favorites } = this.props;

        if(componentsHelpers.calculations.isFavorite(selectedWeather, favorites)){
            const { deleteFavorite, selectedWeather: { key } } = this.props;

            deleteFavorite(key);
        } else {
            const { addFavorite, selectedWeather: { term, name, weatherText, temperatureValue, key } } = this.props;
            const favorite = {
                id: key,
                term,
                name,
                currentWeather: {
                    weatherText,
                    temperatureValue
                }
            };

            addFavorite(favorite);
        }
    };

    onInputChange = ({ target: { value } }) => {
        this.setState({
            term: value
        });
    };

    onFormSubmit = (event) => {
        event.preventDefault();

        const { fetchWeatherAndForecast } = this.props;
        const { term } = this.state;

        if(this.validate()){
            fetchWeatherAndForecast(term);
        }
    };

    validate = () => {
        const { term } = this.state;

        if(!componentsHelpers.others.validateInput(term)){
            this.setState({
                inputError: translations.main.inputError
            });

            return false;
        }

        this.setState({
            inputError: false
        });

        return true;
    };

    renderError(){
        const { selectedWeather } = this.props;
        let error = this.state.inputError;

        if(!error && selectedWeather){
            error = selectedWeather.error;
        }

        if(error){
            const { isLight } = this.props;
            const errorToastClasses = componentsHelpers.styling.getErrorToastClass(isLight);

            return (
                <div className={errorToastClasses}>
                    <i className="fas fa-exclamation-triangle"/>
                    {error}
                </div>
            );
        }

        return null;
    }

    renderFivedayForecast(){
        const { selectedWeather: { fivedayForecast }, isCelsius } = this.props;
        const temperatureChar = componentsHelpers.text.getTemperatureChar(isCelsius);

        if(fivedayForecast){
            const { headline, daysWeather } = fivedayForecast;

            return (
                <>
                    <h1>{headline}</h1>
                    <div className="cardsContainer">
                        {daysWeather.map(({day, temperature}, key) => (
                            <div key={key} className="cardItem">
                                <div className="dayTitle">
                                    <h3>{day}</h3>
                                </div>
                                <h3>{componentsHelpers.others.getTemperature(isCelsius, temperature)}&#176; {temperatureChar}</h3>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        return null;
    }

    renderFavoritesButton(){
        const { selectedWeather, favorites, isLight } = this.props;

        const isFavorite = componentsHelpers.calculations.isFavorite(selectedWeather, favorites);
        const [iconClasses, buttonClasses] = componentsHelpers.styling.getFavoritesClasses({ favorites, isLight });

        return (
            <div className="favoritesButtonContainer">
                <i className={iconClasses}/>
                <button className={buttonClasses} onClick={this.onFavoritesClick}>
                    { isFavorite ? translations.main.deleteFavoritesButtonText : translations.main.addFavoritesButtonText }
                </button>
            </div>
        );
    }

    renderContainer(){
        const { selectedWeather } = this.props;

        if(selectedWeather && !selectedWeather.error){
            const { temperatureValue, name } = selectedWeather;

            return (
                <>
                    {this.renderFavoritesButton()}
                    <div className="singleCityCard">
                        <p>{name}</p>
                        <p>{temperatureValue}&#176; C</p>
                    </div>
                    {this.renderFivedayForecast()}
                </>
            );
        }

        return null;
    }

    render() {
        const { term, autocompleteTerms } = this.state;

        // TODO - Make autocomplete
        return (
            <>
                <form onSubmit={this.onFormSubmit} autoComplete={false}>
                    <div className="autocompleteInput">
                        <input
                            type="text"
                            value={term}
                            placeholder={translations.main.inputPlaceholder}
                            onChange={this.onInputChange}
                        />
                    </div>
                    {this.renderError()}
                </form>
                {this.renderContainer()}
            </>
        );
    }
}

const mapStateToProps = ({ weather: { selectedWeather, favorites = [], autocompleteTerms }, app: { isMainPage, isLight, isCelsius } }, { isFirstLoad, onFirstLoad }) => {
    return {
        selectedWeather,
        favorites,
        autocompleteTerms,
        isMainPage,
        isLight,
        isCelsius,
        isFirstLoad,
        onFirstLoad
    };
};

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast, fetchWeatherByGeoposition, addFavorite, deleteFavorite, togglePage }
)(Main);