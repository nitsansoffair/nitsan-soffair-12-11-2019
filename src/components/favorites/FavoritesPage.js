import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectCity } from '../../actions/weatherActions';
import { Link } from 'react-router-dom';
import { mock } from '../../data/mock';

class FavoritesPage extends Component {
    handleFavorite = (id) => {};

    render() {
        const { favorites = [], selectCity } = this.props;

        // TODO - Migrate to Cards
        return (
            <div>
                {favorites.map(({ id, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id}>
                        <div>
                            <Link to="/" onClick={() => this.handleFavorite(id)}>
                                <h3>{name}</h3>
                            </Link>
                            <p>{temperatureValue}</p>
                        </div>
                        <p>{weatherText}</p>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state,
        ...mock
    };
};

export default connect(
    mapStateToProps,
    { selectCity }
)(FavoritesPage);