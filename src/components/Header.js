import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleTemperature } from '../actions/appActions';
import { Link } from 'react-router-dom';
import componentsHelpers from './helpers';
import _ from 'lodash';
import { TIME_PERIOD } from './constants';
import translations from '../data/translations';

class Header extends Component {
    constructor(props) {
        super(props);

        this.links = {
            home: React.createRef(),
            favorites: React.createRef()
        };
    }

    componentDidMount() {
        this.updateLinksClasses();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.updateLinksClasses();
        }
    }

    updateLinksClasses(){
        const { isMainPage } = this.props;
        const { home, favorites } = this.links;

        if(isMainPage){
            favorites.current.classList.remove('active');
            home.current.classList.add('active');
        } else {
            home.current.classList.remove('active');
            favorites.current.classList.add('active');
        }
    }

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

        const [linkItemClasses, themeButtonClasses] = componentsHelpers.styling.getHeaderClasses(isLight);

        return (
            <div className="mainMenu">
                <div className="slugTitle">
                    <p>{translations.header.slugText}</p>
                </div>
                <button className={themeButtonClasses} onClick={_.throttle(this.handleToggleTheme, TIME_PERIOD)}>
                    {componentsHelpers.text.getThemeButtonText(isLight)}
                </button>
                <button className="toggleButton" onClick={_.throttle(this.handleToggleTemperature, TIME_PERIOD)}>
                    {componentsHelpers.text.getTemperatureButtonText(isCelsius)}
                </button>
                <div className="rightMenu">
                    <Link to="/" className={linkItemClasses} ref={home}>
                        {translations.header.mainLinkText}
                    </Link>
                    <Link to="/favorites" className={linkItemClasses} ref={favorites}>
                        {translations.header.favoritesLinkText}
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ app: { isLight, isCelsius, isMainPage } }) => {
    return {
        isLight,
        isCelsius,
        isMainPage
    };
};

export default connect(
    mapStateToProps,
    { toggleTheme, toggleTemperature }
)(Header);