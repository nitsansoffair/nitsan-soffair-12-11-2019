import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Header from './Header';
import Main from './Main';
import Favorites from './Favorites';
import componentsHelpers from "./helpers";

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            firstLoad: false // TODO - Change to true and remove mock later
        };
    }

    onFirstLoad = () => {
        this.setState({
            firstLoad: false
        });
    };

    render() {
        const { firstLoad } = this.state;
        const { isLight } = this.props;

        const containerClasses = componentsHelpers.getContainerClass(isLight);

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