import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleTemperature } from '../actions/weatherActions';
import { Link } from 'react-router-dom';
import translations from '../data/translations';
import '../style/header.scss';

class Header extends Component {
    constructor(props) {
        super(props);

        this.links = {
            home: React.createRef(),
            favorites: React.createRef()
        };
    }

    handleClick = ({ target }) => {
        Object.values(this.links).forEach(({ current }) => {
            current.classList.remove('active');
        });

        target.classList.add('active');
    };

    handleToggleTheme = () => {
        const { isLight, toggleTheme } = this.props;

        toggleTheme(isLight);
    };

    handleToggleTemperature = () => {
        const { isCelsius, toggleTemperature } = this.props;

        toggleTemperature(isCelsius);
    };

    render() {
        const { home, favorites } = this.links;
        const { isLight, isCelsius } = this.props;
        const itemClasses = isLight ? "item" : "darkItem";
        const buttonClasses = isLight ? "toggleButton light" : "toggleButton dark";

        return (
            <div className="navbar">
                <p>Herolo Weather Test</p>
                <button className={buttonClasses} onClick={this.handleToggleTheme}>
                    {isLight ? translations.header.themeButtonDark : translations.header.themeButtonLight}
                </button>
                <button className="toggleButton" onClick={this.handleToggleTemperature}>
                    {isCelsius ? translations.header.temperatureButtonFahrenheit : translations.header.temperatureButtonCelsius}
                </button>
                <div className="right">
                    <Link to="/" className={`${itemClasses} active`} ref={home} onClick={this.handleClick}>
                        Home
                    </Link>
                    <Link to="/favorites" className={itemClasses} ref={favorites} onClick={this.handleClick}>
                        Favorites
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(
    mapStateToProps,
    { toggleTheme, toggleTemperature }
)(Header);