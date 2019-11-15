import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, addFavorite, deleteFavorite } from '../actions/weatherActions';
import translations from '../data/translations';

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
                    <div className="ui cards">
                        {daysWeather.map(({day, temperature}, key) => (
                            <div key={key} className="card">
                                <div className="content">
                                    <div className="header">
                                        {day}
                                    </div>
                                    <div className="meta">
                                        {temperature}&#176; C
                                    </div>
                                </div>
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
        const iconClassNames = isFavoriteWeather ? "heart outline icon" : "heart icon";

        return (
            <div className="ui segment">
                <i className={iconClassNames}/>
                <button className="ui button" onClick={this.onFavoritesClick}>
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
                <div className="ui container">
                    <div className="ui segment">
                        <p>{name}</p>
                        <p>{temperatureValue}&#176; C</p>
                    </div>
                    {this.renderFavoritesButton()}
                    {this.renderFivedayForecast()}
                </div>
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
            <div>
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <input
                        type="text"
                        value={term}
                        placeholder={translations.main.inputPlaceholder}
                        onChange={this.onInputChange}
                    />
                </form>
                {this.renderContainer()}
                {this.renderError()}
            </div>
        );
    }
}

const isFavorite = (selectedWeather, favorites = []) => {
    for(let i = 0; i < favorites.length; i++){
        if(selectedWeather && selectedWeather.key.toString() === favorites[i].id.toString()){
            return true;
        }
    }

    return false;
};

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