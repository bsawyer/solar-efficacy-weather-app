import React from 'react';
import {render} from 'react-dom';
import {App} from './app';
import {ThemeContextProvider} from './theme';
import {DrawerContextProvider} from './drawer';
import {WeatherContextProvider} from './weather';
import {PercentContextProvider} from './percent';

const app = document.getElementById('app');

render(
  <ThemeContextProvider>
    <DrawerContextProvider>
      <WeatherContextProvider>
        <PercentContextProvider>
          <App />
        </PercentContextProvider>
      </WeatherContextProvider>
    </DrawerContextProvider>
  </ThemeContextProvider>,
  app
);
