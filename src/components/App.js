import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import componentsHelpers from './helpers';
import Header from './Header';
import Main from './Main';
import Favorites from './Favorites';
import '../style/index.scss';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            isFirstLoad: true
        };
    }

    onFirstLoad = () => {
        this.setState({
            isFirstLoad: false
        });
    };

    render() {
        const { isFirstLoad } = this.state;
        const { isLight } = this.props;

        const containerClasses = componentsHelpers.styling.getContainerClass(isLight);

        return (
            <div className={containerClasses}>
                <Router history={createBrowserHistory}>
                    <Header/>
                    <Switch>
                        <Route path="/" exact render={() => (<Main isFirstLoad={isFirstLoad} onFirstLoad={this.onFirstLoad}/>)}/>
                        <Route path="/favorites" exact render={() => (<Favorites/>)}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = ({ app: { isLight, isCelsius } }) => {
    return {
        isLight,
        isCelsius
    };
};

export default connect(
    mapStateToProps,
    {  }
)(App);