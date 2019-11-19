import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectWeather } from '../actions/weatherActions';
import { Link } from 'react-router-dom';
import componentsHelpers from './helpers';
import '../style/favorites.scss';

class Favorites extends Component {
    handleFavorite = (term) => {
        const { selectWeather } = this.props;

        selectWeather(term);
    };

    render() {
        const { favorites, isCelsius, isLight } = this.props;

        const temperatureChar = componentsHelpers.getTemperatureChar(isCelsius);
        const cardClasses = componentsHelpers.getCardClass(isLight);

        return (
            <div className="cardsContainer">
                {favorites.map(({ id, term, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id} className={cardClasses}>
                        <div className="cardHeader">
                            <Link to="/" onClick={() => this.handleFavorite(term)}>
                                <h3>{name}</h3>
                            </Link>
                            <h3>{componentsHelpers.getTemperature(isCelsius, temperatureValue)}&#176; {temperatureChar}</h3>
                        </div>
                        <h3>{weatherText}</h3>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = ({ selectWeather, favorites = [], isCelsius, isLight }) => {
    return {
        selectWeather,
        favorites,
        isCelsius,
        isLight
    };
};

export default connect(
    mapStateToProps,
    { selectWeather }
)(Favorites);