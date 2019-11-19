import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectWeather } from '../actions/weatherActions';
import { togglePage } from '../actions/appActions';
import { Link } from 'react-router-dom';
import componentsHelpers from './helpers';

class Favorites extends Component {
    componentDidMount() {
        const { togglePage } = this.props;

        togglePage();
    }

    handleFavorite = (term) => {
        const { selectWeather } = this.props;

        selectWeather(term);
    };

    render() {
        const { favorites, isCelsius } = this.props;

        const temperatureChar = componentsHelpers.text.getTemperatureChar(isCelsius);

        return (
            <div className="cardsContainer">
                {favorites.map(({ id, term, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id} className="cardItem">
                        <div className="favoriteHeader">
                            <Link to="/" onClick={() => this.handleFavorite(term)}>
                                <h3>{name}</h3>
                            </Link>
                            <h3>{componentsHelpers.others.getTemperature(isCelsius, temperatureValue)}&#176; {temperatureChar}</h3>
                        </div>
                        <h3>{weatherText}</h3>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = ({ weather: { selectWeather, favorites = [] }, app: { isCelsius, isLight } }) => {
    return {
        selectWeather,
        favorites,
        isCelsius,
        isLight
    };
};

export default connect(
    mapStateToProps,
    { selectWeather, togglePage }
)(Favorites);