import {
  mmToInches,
  fahrenheitToCelsius,
  calcPercent
} from '../util';

describe('mmToInches', () => {
  test('it should convert mm to inches', () => {
    expect(mmToInches(1)).toEqual('0.04');
  });
});

describe('fahrenheitToCelsius', () => {
  test('it should convert fahrenheit to celsius', () => {
    expect(fahrenheitToCelsius(1)).toEqual(-17.22222222222222);
  });
});

describe('calcPercent', () => {
  test('it should calculate the percent', () => {
    expect(calcPercent(5, 0, 10)).toEqual(.5);
  });
});
