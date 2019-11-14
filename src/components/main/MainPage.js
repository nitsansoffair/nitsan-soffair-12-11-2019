import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast, addFavorite, deleteFavorite } from '../../actions/weatherActions';
import { mock } from '../../data/mock';

class MainPage extends Component {
    state = {
        term: ''
    };

    onFavoritesClick = () => {
        const { selectedWeather: { key, isFavorite } } = this.props;

        if(isFavorite){
            const { deleteFavorite } = this.props;

            deleteFavorite(key);
        } else {
            const { addFavorite, selectedWeather: { name, weatherText, temperatureValue } } = this.props;
            const favorite = {
                id: key,
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

    // TODO - Render error message
    validate = () => {
        const { term } = this.state;

        if(!/[a-zA-Z]+/.test(term)){
            this.setState({
                error: 'Only english letters allowed.'
            });

            return false;
        }

        this.setState({
            error: false
        });

        return true;
    };

    renderFivedayForecast(){
        const { selectedWeather: { fivedayForecast } } = this.props;

        if(fivedayForecast){
            const { headline, daysWeather } = fivedayForecast;

            return (
                <div>
                    <h1>{headline}</h1>
                    {daysWeather.map(({day, temperature}, key) => (
                        <React.Fragment key={key}>
                            <p>{day}</p>
                            <p>{temperature}&#176; C</p>
                        </React.Fragment>
                    ))}
                </div>
            );
        }

        return null;
    }

    renderFavoritesButton(){
        const { selectedWeather: { isFavorite } } = this.props;
        const iconClassNames = isFavorite ? "heart outline icon" : "heart icon";

        return (
            <div>
                <i className={iconClassNames}/>
                <button className="ui button" onClick={this.onFavoritesClick}>
                    {isFavorite ? "Remove From Favorites" : "Add To Favorites"}
                </button>
            </div>
        );
    }

    renderContainer(){
        const { selectedWeather } = this.props;

        if(selectedWeather){
            const { temperatureValue, LocalizedName } = selectedWeather;

            return (
                <div>
                    <div>
                        <p>{LocalizedName}</p>
                        <p>{temperatureValue}&#176; C</p>
                        {this.renderFavoritesButton()}
                        {this.renderFivedayForecast()}
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
                        placeholder="Search city..."
                        onChange={this.onInputChange}
                    />
                </form>
                {this.renderContainer()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // TODO - Remove mock later
    return {
        ...state,
        ...mock
    };
};

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast, addFavorite, deleteFavorite }
)(MainPage);