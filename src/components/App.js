import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Header from './Header';
import MainPage from './main/MainPage';
import FavoritesPage from './favorites/FavoritesPage';
// import '../style/index.scss';

class App extends Component {
    render() {
        return (
            <div>
                <Router history={createBrowserHistory}>
                    <Switch>
                        <Header/>
                        <Route path="/" exact component={MainPage}/>
                        <Route path="/favorites" exact compoent={FavoritesPage}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;