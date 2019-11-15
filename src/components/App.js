import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Cache from '../cache';
import Header from './Header';
import MainPage from './Main';
import FavoritesPage from './Favorites';
import '../style/index.scss';
import { mock } from '../data/mock';

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

        return (
            <div>
                <Router history={createBrowserHistory}>
                    <Header/>
                    <div className="ui container">
                        <Switch>
                            <Route path="/" exact render={() => (<MainPage firstLoad={firstLoad} onFirstLoad={this.onFirstLoad} {...mock}/>)}/>
                            <Route path="/favorites" exact render={() => (<FavoritesPage {...mock}/>)}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;