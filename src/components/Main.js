import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, fetchWeatherByGeoposition, getAutocompleteTerms, addFavorite, deleteFavorite } from '../actions/weatherActions';
import { togglePage } from '../actions/appActions';
import transformer from '../actions/transformer';
import componentsHelpers from './helpers';
import actionHelpers from '../actions/helpers';
import _ from 'lodash';
import { TIME_PERIOD, ARROW_DOWN, ARROW_UP, ENTER, ESCAPE } from './constants';
import translations from '../data/translations';

class Main extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            term: translations.main.defaultTerm
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const { isFirstLoad, onFirstLoad, togglePage, isMainPage } = this.props;

        this._isMounted = true;

        if (isFirstLoad) {
            this.fetchGeolocation();

            onFirstLoad();
        }

        !isMainPage && togglePage();
    }

    componentWillUnmount() {
        this.closeAutocomplete();

        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            const { current: { value } } = this.inputRef;
            const { selectedWeather } = this.props;

            if(!selectedWeather || selectedWeather.name !== value){
                this.createAutocompleteElement();
            }
        }
    }

    fetchGeolocation() {
        const { fetchWeatherByGeoposition } = this.props;

        navigator.geolocation.getCurrentPosition(({coords}) => {
            fetchWeatherByGeoposition(transformer.geoPositionParams(coords));
        });
    }

    createAutocompleteElement() {
        const { autocompleteTerms, isLight } = this.props;
        const { current: { value } } = this.inputRef;

        if(actionHelpers.validators.array(autocompleteTerms) && value){
            const { focusedElemIdx } = this.state;
            let autocompleteElems = [];
            this.autocompleteRefs = [];

            document.addEventListener('click', this.throttledCloseAutocomplete);

            autocompleteTerms.forEach(({ name, key } ) => {
                const autocompletePrefix = name.substr(0, value.length);

                if (autocompletePrefix.toUpperCase() === value.toUpperCase()) {
                    const ref = React.createRef();

                    const autocompletePostfix = name.substr(value.length, name.length);
                    const termDivClasses = `autocompleteItems ${isLight ? 'lightAutocomplete' : 'darkAutocomplete'} ${key === focusedElemIdx ? 'autocompleteActive' : ''}`;

                    const termDivElem = (
                        <div
                            key={key}
                            className={termDivClasses}
                            onClick={_.throttle(() => this.handleAutocompleteClick(name), TIME_PERIOD)}
                            ref={ref}
                        >
                            <strong>
                                {autocompletePrefix}
                            </strong>
                            {autocompletePostfix}
                        </div>
                    );

                    this.autocompleteRefs = [
                        ...this.autocompleteRefs,
                        ref
                    ];

                    autocompleteElems = [
                        ...autocompleteElems,
                        termDivElem
                    ];
                }
            });

            this.safeSetState({
                autocompleteElems,
                focusedElemIdx
            });
        }
    }

    closeAutocomplete = (setState = true) => {
        if(setState){
            this.safeSetState({
                autocompleteElems: null,
                focusedElemIdx: null
            });
        }

        this.autocompleteRefs = null;

        document.removeEventListener('click', this.throttledCloseAutocomplete);
    };

    updateAutocompleteClasses(focusedElemIdx, updatedFocusedElemIdx){
        this.autocompleteRefs[focusedElemIdx] && this.autocompleteRefs[focusedElemIdx].current.classList.remove("autocompleteActive");
        this.autocompleteRefs[updatedFocusedElemIdx] && this.autocompleteRefs[updatedFocusedElemIdx].current.classList.add("autocompleteActive");
    };

    safeSetState(newState){
        this._isMounted && this.setState(newState);
    };

    onFavoritesClick = _.throttle(() => {
        const { selectedWeather, favorites } = this.props;

        if (componentsHelpers.calculations.isFavorite(selectedWeather, favorites)) {
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
    }, TIME_PERIOD);

    throttledCloseAutocomplete = _.throttle(this.closeAutocomplete, TIME_PERIOD);

    handleAutocompleteClick = (term) => {
        this.safeSetState({
            term,
            autocompleteElems: null,
            focusedElemIdx: null
        });

        this.closeAutocomplete(false);
    };

    handleAutocompleteKeys = (key) => {
        if(actionHelpers.validators.array(this.autocompleteRefs)){
            const { autocompleteTerms } = this.props;
            const { focusedElemIdx } = this.state;
            let updatedFocusedElemIdx;

            switch (key) {
                case ARROW_UP:
                    if(componentsHelpers.validators.exists(focusedElemIdx)){
                        updatedFocusedElemIdx = (focusedElemIdx - 1 + this.autocompleteRefs.length) % this.autocompleteRefs.length;
                    } else {
                        return;
                    }
                    break;
                case ARROW_DOWN:
                    if(componentsHelpers.validators.exists(focusedElemIdx)){
                        updatedFocusedElemIdx = (focusedElemIdx + 1 + this.autocompleteRefs.length) % this.autocompleteRefs.length;
                    } else {
                        updatedFocusedElemIdx = 0;
                    }
                    break;
                case ENTER:
                    if(focusedElemIdx){
                        this.handleAutocompleteClick(autocompleteTerms[focusedElemIdx].name);

                        return;
                    }

                    this.handleAutocompleteClick(this.inputRef.current.value);

                    return;
                case ESCAPE:
                    this.closeAutocomplete();

                    return;
                default:
                    return;
            }

            this.safeSetState({
                focusedElemIdx: updatedFocusedElemIdx
            });

            this.updateAutocompleteClasses(focusedElemIdx, updatedFocusedElemIdx);
        }
    };

    onInputChange = (value) => {
        const { getAutocompleteTerms } = this.props;

        this.safeSetState({
            term: value
        });

        if(value && this.validate(value)){
            getAutocompleteTerms(value);
            this.createAutocompleteElement();
        }

    };

    onFormSubmit = (event) => {
        event.preventDefault();

        const { fetchWeatherAndForecast, autocompleteTerms } = this.props;
        const { current: { value } } = this.inputRef;

        if(value && this.validate(value)){
            fetchWeatherAndForecast(value, autocompleteTerms);
        }
    };

    validate = (term) => {
        if(!componentsHelpers.validators.input(term)){
            this.safeSetState({
                inputError: translations.main.inputError
            });

            return false;
        }

        this.safeSetState({
            inputError: false
        });

        return true;
    };

    renderError(){
        const error = this.state.inputError || this.props.serverError;

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
        const { term, autocompleteElems } = this.state;
        const { serverError } = this.props;

        return (
            <>
                <form onSubmit={this.onFormSubmit} autoComplete="false">
                    <div className="autocompleteInput">
                        <input
                            type="text"
                            value={term}
                            placeholder={translations.main.inputPlaceholder}
                            onChange={({ target: { value } }) => _.throttle((value) => this.onInputChange(value), TIME_PERIOD)(value)}
                            onKeyDown={({ key }) => _.throttle((key) => this.handleAutocompleteKeys(key), TIME_PERIOD)(key)}
                            ref={this.inputRef}
                        />
                        {autocompleteElems}
                    </div>
                    {this.renderError()}
                </form>
                {!serverError && this.renderContainer()}
            </>
        );
    }
}

const mapStateToProps = ({ weather: { selectedWeather = {}, favorites = [], autocompleteTerms = [] }, app: { isMainPage, isLight, isCelsius } }, { isFirstLoad, onFirstLoad }) => {
    const serverError = selectedWeather.error || favorites.error || autocompleteTerms.error;

    return {
        selectedWeather,
        favorites,
        autocompleteTerms,
        isMainPage,
        isLight,
        isCelsius,
        isFirstLoad,
        onFirstLoad,
        serverError
    };
};

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast, fetchWeatherByGeoposition, getAutocompleteTerms, addFavorite, deleteFavorite, togglePage }
)(Main);