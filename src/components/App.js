import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Cache from '../cache';
import Header from './Header';
import Main from './Main';
import Favorites from './Favorites';

class App extends Component {
    constructor(props){
        super(props);

        // TODO - Change to true and remove mock later
        this.state = {
            firstLoad: false
        };

        Cache.init();
    }

    onFirstLoad = () => {
        this.setState({
            firstLoad: false
        });
    };

    render() {
        const { firstLoad } = this.state;
        const { isLight } = this.props;
        const containerClasses = isLight ? "pageContainer" : "pageContainer darkContainer";

        return (
            <div className={containerClasses}>
                <Router history={createBrowserHistory}>
                    <Header/>
                    <Switch>
                        <Route path="/" exact render={() => (<Main firstLoad={firstLoad} onFirstLoad={this.onFirstLoad}/>)}/>
                        <Route path="/favorites" exact render={() => (<Favorites/>)}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(
    mapStateToProps,
    {  }
)(App);