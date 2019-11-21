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
import '../style/components/index.scss';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: translations.main.defaultTerm
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const { isFirstLoad, onFirstLoad, togglePage, isMainPage } = this.props;

        if (isFirstLoad) {
            // this.fetchGeolocation();

            onFirstLoad();
        }

        !isMainPage && togglePage();
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

        if(autocompleteTerms && value){
            const { focusedElemIdx } = this.state;
            let autocompleteElems = [];
            this.autocompleteRefs = [];

            autocompleteTerms.forEach((autocompleteTerm, key) => {
                const autocompletePrefix = autocompleteTerm.substr(0, value.length);

                if (autocompletePrefix.toUpperCase() === value.toUpperCase()) {
                    const ref = React.createRef();

                    const autocompletePostfix = autocompleteTerm.substr(value.length, autocompleteTerm.length);
                    const termDivClasses = `autocompleteItems ${isLight ? 'lightAutocomplete' : 'darkAutocomplete'} ${key === focusedElemIdx ? 'autocompleteActive' : ''}`;

                    const termDivElem = (
                        <div
                            key={key}
                            className={termDivClasses}
                            onClick={_.throttle(() => this.handleAutocompleteClick(autocompleteTerm), TIME_PERIOD)}
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

            this.setState({
                autocompleteElems,
                focusedElemIdx
            });
        }
    }

    closeAutocomplete(){
        this.setState({
            autocompleteElems: null,
            focusedElemIdx: null
        });

        this.autocompleteRefs = null;
    }

    updateAutocompleteClasses(focusedElemIdx, updatedFocusedElemIdx){
        this.autocompleteRefs[focusedElemIdx] && this.autocompleteRefs[focusedElemIdx].current.classList.remove("autocompleteActive");
        this.autocompleteRefs[updatedFocusedElemIdx] && this.autocompleteRefs[updatedFocusedElemIdx].current.classList.add("autocompleteActive");
    };

    onFavoritesClick = () => {
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
    };

    handleAutocompleteClick = (term) => {
        this.setState({
            term
        });

        this.closeAutocomplete();
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
                    this.handleAutocompleteClick(autocompleteTerms[focusedElemIdx]);
                    this.closeAutocomplete();

                    return;
                case ESCAPE:
                    this.closeAutocomplete();

                    return;
                default:
                    break;
            }

            this.setState({
                focusedElemIdx: updatedFocusedElemIdx
            });

            this.updateAutocompleteClasses(focusedElemIdx, updatedFocusedElemIdx);
        }
    };

    onInputChange = ({ target: { value } }) => {
        const { getAutocompleteTerms } = this.props;

        this.setState({
            term: value
        });

        // value && getAutocompleteTerms(value);

        this.createAutocompleteElement();
    };

    onFormSubmit = (event) => {
        event.preventDefault();

        const { fetchWeatherAndForecast } = this.props;
        const { term } = this.state;

        if(this.validate()){
            // fetchWeatherAndForecast(term);
        }
    };

    validate = () => {
        const { term } = this.state;

        if(!componentsHelpers.validators.input(term)){
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
                            onChange={_.throttle((e) => this.onInputChange(e), TIME_PERIOD)}
                            onKeyDown={_.throttle(({ key }) => this.handleAutocompleteKeys(key), TIME_PERIOD)}
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