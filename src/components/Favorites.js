import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectWeather } from '../actions/weatherActions';
import { Link } from 'react-router-dom';

class Favorites extends Component {
    handleFavorite = (term) => {
        const { selectWeather } = this.props;

        selectWeather(term);
    };

    render() {
        const { favorites = [] } = this.props;

        return (
            <div className="ui cards">
                {favorites.map(({ id, term, name, currentWeather: { weatherText, temperatureValue } }) => (
                    <div key={id} className="card">
                        <div className="content">
                            <div className="header">
                                <Link to="/" onClick={() => this.handleFavorite(term)}>
                                    <h3>{name}</h3>
                                </Link>
                            </div>
                            <div className="meta">
                                {temperatureValue}
                            </div>
                            <div className="description">
                                {weatherText}
                            </div>
                        </div>
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