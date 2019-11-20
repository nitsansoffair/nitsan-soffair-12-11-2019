import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, fetchWeatherByGeoposition, getAutocompleteTerms, addFavorite, deleteFavorite } from '../actions/weatherActions';
import { togglePage } from '../actions/appActions';
import transformer from '../actions/transformer';
import componentsHelpers from './helpers';
import _ from 'lodash';
import { TIME_PERIOD } from './constants';
import translations from '../data/translations';
import '../style/index.scss';
import CacheInstance from "../cache";

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: translations.main.defaultTerm
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const {isFirstLoad, onFirstLoad, togglePage, isMainPage} = this.props;

        if (isFirstLoad) {
            // this.fetchGeolocation();

            onFirstLoad();
        }

        !isMainPage && togglePage();
    }

    fetchGeolocation() {
        const {fetchWeatherByGeoposition} = this.props;

        navigator.geolocation.getCurrentPosition(({coords}) => {
            fetchWeatherByGeoposition(transformer.geoPositionParams(coords));
        });
    }

    createAutocompleteElement() {
        const { autocompleteTerms } = this.props;
        const { current: { value } } = this.inputRef;
        let autocompleteElems = [];

        // TODO - Validate Cache
        console.log(
            CacheInstance.setWeather(value, this.props.selectedWeather),
            CacheInstance.setTerms(value, autocompleteTerms),
            CacheInstance.getTerms(value),
            CacheInstance.getWeather(value)
        );

        autocompleteTerms.forEach((autocompleteTerm, key) => {
            const autocompletePrefix = autocompleteTerm.substr(0, value.length);

            if (value && autocompletePrefix.toUpperCase() === value.toUpperCase()) {
                const autocompletePostfix = autocompleteTerm.substr(value.length, autocompleteTerm.length);

                const termDivElem = (
                    <div key={key} className="autoCompleteItems"
                         onClick={_.throttle(() => this.handleAutocompleteClick(autocompleteTerm), TIME_PERIOD)}>
                        <strong>
                            {autocompletePrefix}
                        </strong>
                        {autocompletePostfix}
                    </div>
                );

                autocompleteElems = [
                    ...autocompleteElems,
                    termDivElem
                ];
            }
        });

        this.setState({
            autocompleteElems
        });
    }

    onFavoritesClick = () => {
        const {selectedWeather, favorites} = this.props;

        if (componentsHelpers.calculations.isFavorite(selectedWeather, favorites)) {
            const {deleteFavorite, selectedWeather: {key}} = this.props;

            deleteFavorite(key);
        } else {
            const {addFavorite, selectedWeather: {term, name, weatherText, temperatureValue, key}} = this.props;
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

    handleAutocompleteClick = (term) => {
        this.setState({
            term,
            autocompleteElems: null
        });
    };

    onInputChange = ({ target: { value } }) => {
        const { getAutocompleteTerms } = this.props;

        this.setState({
            term: value
        });

        getAutocompleteTerms();

        this.createAutocompleteElement();
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
                <button className={buttonClasses} onClick={_.throttle(this.onFavoritesClick, TIME_PERIOD)}>
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
        const { term, autocompleteElems } = this.state;

        return (
            <>
                <form onSubmit={this.onFormSubmit} autoComplete="false">
                    <div className="autocompleteInput">
                        <input
                            type="text"
                            value={term}
                            placeholder={translations.main.inputPlaceholder}
                            onChange={this.onInputChange}
                            ref={this.inputRef}
                        />
                        {autocompleteElems}
                    </div>
                    {this.renderError()}
                </form>
                {this.renderContainer()}
            </>
        );
    }
}

const mapStateToProps = ({ weather: { selectedWeather, favorites = [], autocompleteTerms = [] }, app: { isMainPage, isLight, isCelsius } }, { isFirstLoad, onFirstLoad }) => {
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
    { fetchWeatherAndForecast, fetchWeatherByGeoposition, getAutocompleteTerms, addFavorite, deleteFavorite, togglePage }
)(Main);