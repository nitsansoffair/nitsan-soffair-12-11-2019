import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectWeather } from '../actions/weatherActions';
import { Link } from 'react-router-dom';
import { toFahrenheit } from '../actions/helpers';
import translations from '../data/translations';
import '../style/favorites.scss';

class Favorites extends Component {
    handleFavorite = (term) => {
        const { selectWeather } = this.props;

        selectWeather(term);
    };

    render() {
        const { favorites = [], isCelsius } = this.props;
        const temperatureChar = isCelsius ? translations.main.celsiusChar : translations.main.fahrenheitChar;

        return (
            <div className="cardsContainer">
                {favorites.map(({ id, term, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id} className="cardItem">
                        <div className="cardHeader">
                            <Link to="/" onClick={() => this.handleFavorite(term)}>
                                <h3>{name}</h3>
                            </Link>
                            <h3>{isCelsius ? temperatureValue : toFahrenheit(temperatureValue)}&#176; {temperatureChar}</h3>
                        </div>
                        <h3>{weatherText}</h3>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        ...state
    };
};

export default connect(
    mapStateToProps,
    { selectWeather }
)(Favorites);