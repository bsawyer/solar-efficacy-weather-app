import {NeuralNetwork} from 'brain.js';
import netData from './net.json';

export const net = new NeuralNetwork();
// @ts-ignore
net.fromJSON(netData);

export function predictDaily(data){
  return (
    net.run({
      temp: calcPercent(data.temp.day, -128.6, 134), // need to handle metric
      cloudcover: data.clouds / 100,
      precip: calcPercent(mmToInches(data.rain || 0), 0, 14), // metric
      wspd: calcPercent(data.wind_speed, 0, 254), //metric
      humidity: data.humidity / 100,
      // @ts-ignore
    }).generatedkW * 100
  ).toFixed();
}

export function mmToInches(mm){
  return (mm / 25.4).toFixed(2);
}

export function fahrenheitToCelsius(f){
  return (f - 32) * 5 / 9;
}

export function calcPercent(val, min, max){
  return (val + (-1 * min)) / (max + (-1 * min));
}

export const API_KEY = '1b9adabfb86397e460dd5c776518ee51';
