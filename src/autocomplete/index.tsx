import React, {useState} from 'react';
import * as styles from './autocomplete.module.scss';
import {API_KEY} from '../util';
import {BsSearch, BsFillCursorFill} from 'react-icons/bs';

interface Props {
  onSelect: Function;
}

interface Item{
  select?: Function;
  name: String;
  coords?: {
    latitude: String;
    longitude: String;
  },
  state?: String;
  country?: String;
}

export const Autocomplete = ({
  onSelect
}: Props) => {
  const currentLocationListItem = {
    name: 'Current location',
    coords: null,
    select: () => {
      navigator.geolocation.getCurrentPosition(({coords}) => {
        onSelect({latitude: coords.latitude, longitude: coords.longitude});
      });
    }
  };

  const [list, setList] = useState([currentLocationListItem]);

  let t;
  let query;
  const handleInput = (evt) => {
    if(evt.target.value && evt.target.value.length >= 3){
      if(t){
        query = evt.target.value;
      }else{
        query = evt.target.value;
        t = setTimeout(async () => {
          const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
          const data = await response.json();
          setList([
            currentLocationListItem,
            ...data.map(({name, lat, lon, state, country}) => {
              return {
                name,
                coords: {
                  latitude: lat,
                  longitude: lon
                },
                state,
                country
              }
            })
          ])
          t = null;
          query = null;
        }, 1000);
      }
    }else{
      if(!evt.target.value){
        setList([currentLocationListItem]);
        if(t){
          clearTimeout(t);
          t = null;
          query = null;
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <input className={styles.input} onInput={handleInput} type="text" placeholder="Search by city, state, zip" />
      <BsSearch />
      <div className={styles.list}>
        {list.map(({name, select, coords, state, country}: Item, i) => {
          let handleClick: Function;
          if(select){
            handleClick = select;
          }else{
            handleClick = () => {onSelect(coords)};
          }
          return (
            <div key={i} className={styles.item} onClick={handleClick}>
              {name === 'Current location' && (
                <BsFillCursorFill />
              )}
              {name}{state ? ', ' + state : ''}{country ? ', ' + country : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
