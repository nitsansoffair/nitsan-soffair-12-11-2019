import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleTemperature } from '../actions/weatherActions';
import { Link } from 'react-router-dom';
import componentsHelpers from './helpers';
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
        const { toggleTheme } = this.props;

        toggleTheme();
    };

    handleToggleTemperature = () => {
        const { toggleTemperature } = this.props;

        toggleTemperature();
    };

    render() {
        const { home, favorites } = this.links;
        const { isLight, isCelsius } = this.props;

        const [itemClasses, buttonClasses] = componentsHelpers.getHeaderClasses(isLight);

        return (
            <div className="navbar">
                <p>Herolo Weather Test</p>
                <button className={buttonClasses} onClick={this.handleToggleTheme}>
                    {componentsHelpers.getThemeButtonText(isLight)}
                </button>
                <button className="toggleButton" onClick={this.handleToggleTemperature}>
                    {componentsHelpers.getTemperatureButtonText(isCelsius)}
                </button>
                <div className="right">
                    <Link to="/" className={`${itemClasses} active`} ref={home} onClick={this.handleClick}>
                        {translations.header.mainLinkText}
                    </Link>
                    <Link to="/favorites" className={itemClasses} ref={favorites} onClick={this.handleClick}>
                        {translations.header.favoritesLinkText}
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ toggleTheme, toggleTemperature, isLight, isCelsius }) => {
    return {
        toggleTheme,
        toggleTemperature,
        isLight,
        isCelsius
    };
};

export default connect(
    mapStateToProps,
    { toggleTheme, toggleTemperature }
)(Header);