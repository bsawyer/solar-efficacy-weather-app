import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import * as styles from './percent.module.scss';
import {Card} from '../card';
import {WeatherContext} from '../weather';
import {
  BsFillSunFill,
  BsFillCloudFill
} from 'react-icons/bs';
import {calcPercent} from '../util';

interface Props {
  children: React.children;
}

export const PercentContext = createContext({
  percent: 0,
  setPercent: () => {}
});

export const PercentContextProvider = ({children}: Props) => {
  const setPercent = percent => {
    localStorage.setItem('percent', percent);
    setState({
      ...state,
      percent
    });
  };

  const [state, setState] = useState({
    percent: 0,
    setPercent
  });

  return (
    <PercentContext.Provider value={state}>
      {children}
    </PercentContext.Provider>
  )
};

function formatkW(number){
  return (Math.round(number * 100) / 100).toFixed(2);
}

function capFlexGrow(grow){
  return Math.min(Math.max(grow, 3), 17);
}

export const Percent = () => {
  const {percent} = useContext(PercentContext);

  const min = 0;
  const max = 20;
  const minRange = useRef();
  const maxRange = useRef();

  const [move, setMove] = useState(2);
  const [values, setValues] = useState([min, 5]);

  const updateRanges = ({target}) => {
    let offset = null;

    if(target === minRange.current){
      if(target.valueAsNumber >= Number(target.max)) {
	       offset = Math.min(max - 1, Number(target.max) + 1);
      }
    }

    if(target === maxRange.current){
      if(target.valueAsNumber <= Number(target.min)) {
    	   offset = Math.max(min, Number(target.min) - 2);
      }
    }

    if(offset != null){
    	setMove(Math.min(Math.max(offset, 1), max - 2));
    }

    setValues([
      5 * minRange.current.valueAsNumber / max,
      5 * maxRange.current.valueAsNumber / max
    ]);
  };

  const predictedOutput = (values[1] - values[0]) * (percent / 100) + values[0];

  const radius = 50;
  const strokeWidth = radius * 0.2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = innerRadius * 2 * Math.PI;
  const arc = circumference * (270 / 360);
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(135, ${radius}, ${radius})`;
  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;

  return (
    <Card vertical>
      <div className={styles.gauge}>
        <svg viewBox="0 0 100 100">
			   <circle className={styles.rail} r={innerRadius} cx={radius} cy={radius} />
			   <circle className={styles.progress} r={innerRadius} cx={radius} cy={radius} strokeDasharray={dashArray} transform={transform} style={{strokeDashoffset: offset}}/>
		    </svg>
        <div className={styles.percent}>{percent}<span>%</span></div>
      </div>
      <div className={`${styles.row} ${styles.rel}`}>
        <div className={styles.cursor} style={{transform: `translateX(${calcPercent(predictedOutput, 0, max / 4) * 76 - 38}% )`}}>
          {formatkW(predictedOutput)}<span className={styles.kw}>kW</span>
        </div>
        <BsFillCloudFill />
        <div onMouseDown={updateRanges} onInput={updateRanges} className={styles.range}>
          <input ref={minRange} type="range" min={min} max={move} step="1" id="min" defaultValue={min} style={{flexGrow: capFlexGrow(move + 1)}}/>
          <input ref={maxRange} type="range" min={move + 1} max={max} step="1" id="max"  defaultValue={max} style={{flexGrow: capFlexGrow(max - (move + 1) + 1)}}/>
        </div>
        <BsFillSunFill />
      </div>
      <div className={styles.row}>
        <div>{formatkW(values[0])}<span className={styles.kw}>kW</span></div>
        <div>{formatkW(values[1])}<span className={styles.kw}>kW</span></div>
      </div>
    </Card>
  );
};
