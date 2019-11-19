import { combineReducers } from 'redux';
import weatherReducer from './weatherReducer';
import appReducers from './appReducers';

export default combineReducers({
    weather: weatherReducer,
    app: appReducers
});