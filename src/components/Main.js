import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, addFavorite, deleteFavorite } from '../actions/weatherActions';
import translations from '../data/translations';
import '../style/main.scss';

class Main extends Component {
    state = {
        term: ''
    };

    componentDidMount() {
        const { fetchWeatherAndForecast, firstLoad, onFirstLoad } = this.props;

        if(firstLoad){
            fetchWeatherAndForecast(translations.main.defaultTerm);

            onFirstLoad();
        }
    }

    onFavoritesClick = () => {
        const { selectedWeather, favorites } = this.props;

        if(isFavorite(selectedWeather, favorites)){
            const { deleteFavorite, selectedWeather: { key } } = this.props;

            deleteFavorite(key, favorites);
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

        if(!/[a-zA-Z]+/.test(term)){
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

    renderFivedayForecast(){
        const { selectedWeather: { fivedayForecast } } = this.props;

        if(fivedayForecast){
            const { headline, daysWeather } = fivedayForecast;

            return (
                <>
                    <h1>{headline}</h1>
                    <div className="cardsContainer">
                        {daysWeather.map(({day, temperature}, key) => (
                            <div key={key} className="cardItem">
                                <h3>{day}</h3>
                                <h3>{temperature}&#176; C</h3>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        return null;
    }

    renderFavoritesButton(){
        const { selectedWeather, favorites } = this.props;
        const isFavoriteWeather = isFavorite(selectedWeather, favorites);
        const iconClassNames = isFavoriteWeather ? "fas fa-heart" : "far fa-heart";

        return (
            <div className="buttonContainer">
                <i className={iconClassNames}/>
                <button className="simpleButton" onClick={this.onFavoritesClick}>
                    { isFavoriteWeather ? translations.main.deleteFavoritesButtonText : translations.main.addFavoritesButtonText }
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

    renderError(){
        const { selectedWeather } = this.props;
        let error = this.state.inputError;

        if(!error && selectedWeather){
            error = selectedWeather.error;
        }

        if(error){
            return (
                <div className="ui negative message">
                    <i className="close icon"/>
                    <div className="header">
                        {error}
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        const { term } = this.state;

        return (
            <>
                <form onSubmit={this.onFormSubmit} className="inputForm">
                    <input
                        type="text"
                        value={term}
                        placeholder={translations.main.inputPlaceholder}
                        onChange={this.onInputChange}
                    />
                </form>
                {this.renderContainer()}
                {this.renderError()}
            </>
        );
    }
}

const isFavorite = (selectedWeather, favorites = []) => selectedWeather && favorites.find(({ id }) => id === selectedWeather.key);

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        ...state
    };
};

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast, addFavorite, deleteFavorite }
)(Main);