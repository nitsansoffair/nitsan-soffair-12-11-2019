import { days } from '../data/days';

export const mean = (n1, n2) => (n1 + n2) / 2;

export const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;

export const getDay = (string) => days[new Date(string).getDay()];