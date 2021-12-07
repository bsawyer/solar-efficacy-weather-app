import React, {useContext, useState, useEffect} from 'react';
import * as styles from './app.module.scss';
import {ThemeContext} from './theme';
import {Drawer, DrawerContext} from './drawer';
import {CurrentWeather, WeatherContext} from './weather';
import {Percent, PercentContext} from './percent';
import {Card} from './card';
import {BsThreeDots, BsCheck} from 'react-icons/bs';
// import {NeuralNetwork} from 'brain.js';
// import netData from './net.json';
import {net, mmToInches, predictDaily} from './util';

export function App() {
  const {theme, setTheme} = useContext(ThemeContext);
  const {open, setOpen} = useContext(DrawerContext);
  const {units, setUnits, weather} = useContext(WeatherContext);
  const {setPercent} = useContext(PercentContext);
  const openDrawer = (evt) => {
    if(!open){
      evt.preventDefault();
      evt.stopPropagation();
      setOpen(true);
    }
  };
  const themeChange = (evt) => {
    setTheme(evt.target.value);
  };
  const unitsChange = (evt) => {
    setUnits(evt.target.value);
  };
  useEffect(() => {
    if(weather){
      setPercent(
        predictDaily(weather.data.daily[0])
      )
    }
  }, [weather]);

  return (
    <div className={styles.container}>
      <Drawer>
        <div className={styles.options} onChange={themeChange}>
          <div className={styles.option}>
            <div className={`${styles['option-check']} ${theme === 'default' ? styles['option-check-show'] : ''}`}>
              <BsCheck />
            </div>
            <input type="radio" name="theme" value="default" id="system" />
            <label htmlFor="system">System</label>
          </div>
          <div className={styles.option}>
            <div className={`${styles['option-check']} ${theme === 'light' ? styles['option-check-show'] : ''}`}>
              <BsCheck />
            </div>
            <input type="radio" name="theme" value="light" id="light" />
            <label htmlFor="light">Light</label>
          </div>
          <div className={styles.option}>
            <div className={`${styles['option-check']} ${theme === 'dark' ? styles['option-check-show'] : ''}`}>
              <BsCheck />
            </div>
            <input type="radio" name="theme" value="dark" id="dark" />
            <label htmlFor="dark">Dark</label>
          </div>
        </div>
        <div className={styles.options} onChange={unitsChange}>
          <div className={styles.option}>
            <div className={`${styles['option-check']} ${units === 'imperial' ? styles['option-check-show'] : ''}`}>
              <BsCheck />
            </div>
            <input type="radio" name="units" value="imperial" id="imperial" />
            <label htmlFor="imperial">Imperial</label>
          </div>
          <div className={styles.option}>
            <div className={`${styles['option-check']} ${units === 'metric' ? styles['option-check-show'] : ''}`}>
              <BsCheck />
            </div>
            <input type="radio" name="units" value="metric" id="metric" />
            <label htmlFor="metric">Metric</label>
          </div>
        </div>
      </Drawer>
      <div className={`${open ? styles.blurred : ''} ${styles.cards}`}>
        <div className={styles.buttons}>
          <div tabIndex="0" role="button" onKeyDown={(evt) => {if(evt.keyCode === 13 || evt.keyCode === 32){openDrawer(evt)}}} onClick={openDrawer}>
            <Card button>
              <BsThreeDots />
            </Card>
          </div>
        </div>
        <Percent />
        <CurrentWeather />
      </div>
    </div>
  );
}
