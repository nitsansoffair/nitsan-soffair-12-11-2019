import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, fetchWeatherByGeoposition, addFavorite, deleteFavorite } from '../actions/weatherActions';
import transformer from '../actions/transformer';
import componentsHelpers from './helpers';
import translations from '../data/translations';
import '../style/main.scss';

class Main extends Component {
    state = {
        term: translations.main.defaultTerm
    };

    componentDidMount() {
        const { fetchWeatherByGeoposition, firstLoad, onFirstLoad } = this.props;

        if(firstLoad){
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                fetchWeatherByGeoposition(transformer.geoPositionParams(coords));
            });

            onFirstLoad();
        }
    }

    onFavoritesClick = () => {
        const { selectedWeather, favorites } = this.props;

        if(componentsHelpers.isFavorite(selectedWeather, favorites)){
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

        if(!componentsHelpers.validateInput(term)){
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
            return (
                <div className="errorToast">
                    {error}
                </div>
            );
        }

        return null;
    }

    renderFivedayForecast(){
        const { selectedWeather: { fivedayForecast }, isCelsius } = this.props;
        const temperatureChar = componentsHelpers.getTemperatureChar(isCelsius);

        if(fivedayForecast){
            const { headline, daysWeather } = fivedayForecast;

            return (
                <>
                    <h1>{headline}</h1>
                    <div className="cardsContainer">
                        {daysWeather.map(({day, temperature}, key) => (
                            <div key={key} className="cardItem">
                                <h3>{day}</h3>
                                <h3>{componentsHelpers.getTemperature(isCelsius, temperature)}&#176; {temperatureChar}</h3>
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

        const isFavorite = componentsHelpers.isFavorite(selectedWeather, favorites);
        const [iconClasses, buttonClasses] = componentsHelpers.getFavoritesClasses({ favorites, isLight });

        return (
            <div className="buttonContainer">
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
                    <div className="smallCard">
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
        const { term } = this.state;

        return (
            <>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        type="text"
                        value={term}
                        placeholder={translations.main.inputPlaceholder}
                        onChange={this.onInputChange}
                    />
                </form>
                {this.renderError()}
                {this.renderContainer()}
            </>
        );
    }
}

const mapStateToProps = state => state;

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast, fetchWeatherByGeoposition, addFavorite, deleteFavorite }
)(Main);