import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Cache from '../cache';
import Header from './Header';
import Main from './Main';
import Favorites from './Favorites';
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
            <Router history={createBrowserHistory}>
                <Header/>
                <div className="pageContainer">
                    <Switch>
                        <Route path="/" exact render={() => (<Main firstLoad={firstLoad} onFirstLoad={this.onFirstLoad} {...mock}/>)}/>
                        <Route path="/favorites" exact render={() => (<Favorites {...mock}/>)}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;