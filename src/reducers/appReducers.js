import {
    TOGGLE_PAGE,
    TOGGLE_TEMPERATURE,
    TOGGLE_THEME
} from '../actions/types';

const defaultState = {
    isLight: true,
    isCelsius: true,
    isMainPage: true
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_PAGE:
            return {
                ...state,
                isMainPage: action.payload
            };
        case TOGGLE_THEME:
            return {
                ...state,
                isLight: action.payload
            };
        case TOGGLE_TEMPERATURE:
            return {
                ...state,
                isCelsius: action.payload
            };
        default:
            return state;
    }
};