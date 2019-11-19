import {
    TOGGLE_TEMPERATURE,
    TOGGLE_THEME,
    TOGGLE_PAGE
} from './types';

export const toggleTheme = () => (dispatch, getState) => {
    const { app: { isLight } } = getState();

    dispatch({
        type: TOGGLE_THEME,
        payload: !isLight
    });
},
    toggleTemperature = () => (dispatch, getState) => {
    const { app: { isCelsius } } = getState();

    dispatch({
        type: TOGGLE_TEMPERATURE,
        payload: !isCelsius
    });
},
    togglePage = () => (dispatch, getState) => {
    const { app: { isMainPage } } = getState();

    dispatch({
        type: TOGGLE_PAGE,
        payload: !isMainPage
    });
};