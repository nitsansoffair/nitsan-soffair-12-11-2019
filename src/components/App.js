import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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

        this.containerRef = React.createRef();
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
            <div className={containerClasses} ref={this.containerRef}>
                <BrowserRouter>
                    <Header/>
                    <Switch>
                        <Route path="/" exact render={() => (<Main isFirstLoad={isFirstLoad} onFirstLoad={this.onFirstLoad} containerRef={this.containerRef.current}/>)}/>
                        <Route path="/favorites" exact render={() => (<Favorites/>)}/>
                    </Switch>
                </BrowserRouter>
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