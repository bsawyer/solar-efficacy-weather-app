import React, {createContext, useContext, useState, useEffect} from 'react';
import * as styles from './weather.module.scss';
import {Card} from '../card';
import {
  BsFillCursorFill,
  BsFillCloudLightningFill,
  BsFillCloudDrizzleFill,
  BsFillCloudRainFill,
  BsFillCloudSnowFill,
  BsFillCloudHazeFill,
  BsFillSunFill,
  BsFillCloudFill,
  BsFillCloudSunFill
} from 'react-icons/bs';
import {mmToInches, predictDaily, API_KEY} from '../util';

const WEATHER_CONDITIONS = [
  BsFillCloudLightningFill, // 2
  BsFillCloudDrizzleFill, // 3
  BsFillSunFill, // no 4?
  BsFillCloudRainFill, // 5
  BsFillCloudSnowFill, // 6
  BsFillCloudHazeFill, // 700 +
  BsFillSunFill, // 800
  BsFillCloudSunFill // 800+
];

function getIconIndex(code){
  if(code >= 800){
    return code > 800 ? 7 : 6;
  }
  return Math.floor(code / 100) - 2;
}

interface Props {
  children: React.children;
}

export const WeatherContext = createContext({
  location: null,
  weather: null,
  units: 'imperial',
  setLocation: () => {},
  setWeather: () => {},
  setUnits: () => {}
});

export const WeatherContextProvider = ({children}: Props) => {
  const setLocation = location => {
    localStorage.setItem('location', JSON.stringify(location))
    setState(prev => ({
      ...prev,
      location
    }));
  }

  const setWeather = weather => {
    localStorage.setItem('weather', JSON.stringify(weather))
    setState(prev => ({
      ...prev,
      weather
    }));
  };

  const setUnits = units => {
    localStorage.setItem('units', units)
    setState(prev => ({
      ...prev,
      units
    }));
  };

  const [state, setState] = useState({
    location: JSON.parse(localStorage.getItem('location')),
    weather: JSON.parse(localStorage.getItem('weather')),
    units: localStorage.getItem('units') || 'imperial',
    setLocation,
    setWeather,
    setUnits
  });

  useEffect(() => {
    const fetchData = async (url) => {
      const response = await fetch(url);
      return await response.json();
    };

    const fetchWeather = async () => {
      const [data, current] = await Promise.all([
        fetchData(`https://api.openweathermap.org/data/2.5/onecall?lat=${state.location.latitude}&lon=${state.location.longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${API_KEY}`),
        fetchData(`https://api.openweathermap.org/data/2.5/weather?lat=${state.location.latitude}&lon=${state.location.longitude}&units=${state.units}&appid=${API_KEY}`)
      ]);

      setWeather({
        data,
        current
      })

      console.log(data);
      console.log(current);

      // console.log(new Date( data.daily[0].dt * 1000))
    };

    if(state.location){
      fetchWeather();
    }
  }, [state.units, state.location]);

  return (
    <WeatherContext.Provider value={state}>
      {children}
    </WeatherContext.Provider>
  )
};

export const CurrentWeather = () => {
  const {location, weather, units, setLocation} = useContext(WeatherContext);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(({coords}) => {
      setLocation({latitude: coords.latitude, longitude: coords.longitude});
      setLoading(false);
    }, () => setLoading(false));
  };
  const WeatherConditionIcon = weather ? WEATHER_CONDITIONS[getIconIndex(weather.current.weather[0].id)] : BsFillSunFill;

  return (
    <>
    <div tabIndex="0" onClick={handleClick}>
      <Card placeholder={loading}>
        <div className={styles['weather-current']}>
          {weather ? (
            <>
            <div className={styles.condition}>
              <WeatherConditionIcon />
            </div>
            <div className={styles.place}>
              {weather.current.name}
            </div>
            <div className={styles.temp}>
              {Math.round(weather.current.main.temp)}°
            </div>
            </>
          ) : (
            <div className={styles.get}>
              <BsFillCursorFill />
              <span className={styles.place}>
                Use Location
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
    {weather && (
      <Card vertical>
        <div className={styles['data-row-current']}>
          <div>Temperature</div>
          <div>{weather.current.main.temp}°{units === 'metric' ? 'C' : 'F'}</div>
        </div>
        <div className={styles['data-row-current']}>
          <div>Humidity</div>
          <div>{weather.current.main.humidity}%</div>
        </div>
        <div className={styles['data-row-current']}>
          <div>Clouds</div>
          <div>{weather.current.clouds.all}%</div>
        </div>
        <div className={styles['data-row-current']}>
          <div>Wind</div>
          <div>{weather.current.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</div>
        </div>
        <div className={styles['data-row-current']}>
          <div>Rain</div>
          <div>{units === 'metric' ? (weather.current?.rain?.['1h'] || 0) + ' mm' : mmToInches(weather.current?.rain?.['1h'] || 0) + ' in'}</div>
        </div>
        </Card>
      )}
      {weather && (
        <Card vertical>
          {weather.data.daily.map((data,i)=> {
            const Icon = WEATHER_CONDITIONS[getIconIndex(data.weather[0].id)];
            const p = predictDaily(data);
            const dataDate = new Date(data.dt * 1000);
            return (
              <div key={i} className={`${styles['data-row']}`}>
                  <div>{i === 0 ? 'Today' : dataDate.toLocaleString('en-us', {weekday: 'short'})}</div>
                  <Icon />
                  <div className={styles.bar}>
                    <div className={styles['bar-percent']} style={{width: `${p}%`}}></div>
                  </div>
                  <div className={styles.center}>{p}%</div>
              </div>
            )
          })}
          </Card>
        )}
    </>
  );
};
