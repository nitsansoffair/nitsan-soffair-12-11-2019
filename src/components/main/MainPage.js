import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeatherAndForecast } from '../../actions/weatherActions';
import { getDay } from '../../helpers';

class MainPage extends Component {
    state = {
        term: ''
    };

    onInputChange = ({ target: { value } }) => {
        this.setState({
            term: value
        });
    };

    onFormSubmit = (event) => {
        event.preventDefault();

        const { fetchWeatherAndForecast } = this.props;
        const { term } = this.state;

        if(this.validate()){
            fetchWeatherAndForecast(term);
        }
    };

    // TODO - Render error message
    validate = () => {
        const { term } = this.state;

        if(!/[a-zA-Z]+/.test(term)){
            this.setState({
                error: 'Only english letters allowed.'
            });

            return false;
        }

        this.setState({
            error: false
        });

        return true;
    };

    renderFivedayForecast(){
        const { selectedWeather: { fivedayForecast } } = this.props;

        if(fivedayForecast){
            const { headline, daysWeather } = fivedayForecast;

            return (
                <div>
                    <h1>{headline}</h1>
                    {daysWeather.map(({Date, Temperature}, key) => (
                        <React.Fragment key={key}>
                            <p>{getDay(Date)}</p>
                            <p>{Temperature}&#176; C</p>
                        </React.Fragment>
                    ))}
                </div>
            );
        }

        return null;
    }

    renderWeather(){
        const { selectedWeather } = this.props;

        if(selectedWeather){
            const { WeatherText, temperatureValue, LocalizedName } = selectedWeather;

            return (
                <div>
                    <p>{LocalizedName}</p>
                    <p>{WeatherText}</p>
                    <p>{temperatureValue}&#176; C</p>
                    {this.renderFivedayForecast()}
                </div>
            );
        }

        return null;
    }

    render() {
        const { term } = this.state;

        return (
            <div>
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <input
                        type="text"
                        value={term}
                        placeholder="Search city..."
                        onChange={this.onInputChange}
                    />
                </form>
                {this.renderWeather()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(
    mapStateToProps,
    { fetchWeatherAndForecast }
)(MainPage);