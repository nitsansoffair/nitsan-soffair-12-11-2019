import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectWeather } from '../actions/weatherActions';
import { Link } from 'react-router-dom';
import '../style/favorites.scss';

class Favorites extends Component {
    handleFavorite = (term) => {
        const { selectWeather } = this.props;

        selectWeather(term);
    };

    render() {
        const { favorites = [] } = this.props;

        return (
            <div className="cardsContainer">
                {favorites.map(({ id, term, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id} className="cardItem">
                        <div className="cardHeader">
                            <Link to="/" onClick={() => this.handleFavorite(term)}>
                                <h3>{name}</h3>
                            </Link>
                            <h3>{temperatureValue}&#176; C</h3>
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