import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import * as styles from './drawer.module.scss';
import {BsX} from 'react-icons/bs';

interface Props {
  children: React.children;
}

export const DrawerContext = createContext({
  open: false,
  setOpen: (open: boolean) => {}
});

export const DrawerContextProvider = ({children}: Props) => {
  const [state, setState] = useState({
    open: false,
    setOpen: (open) => {
      setState({
        ...state,
        open
      })
    }
  });

  return (
    <DrawerContext.Provider value={state}>
      {children}
    </DrawerContext.Provider>
  )
};


export const Drawer = ({children}: Props) => {
  const {open, setOpen} = useContext(DrawerContext);
  const drawerRef = useRef();

  useEffect(() => {
    document.body.addEventListener('click', (evt) => {
      if(!drawerRef.current.contains(evt.target) && open){
        setOpen(false);
      }
    });
    document.body.addEventListener('keydown', (evt) => {
      if(evt.keyCode === 27 && open){
        setOpen(false);
      }
    });
  });

  return (
    <div ref={drawerRef} className={`${styles.drawer} ${open ? styles['drawer-open'] : styles['drawer-close']}`}>
      <div className={styles.close} tabIndex="0" onClick={() => { setOpen(false) }}><BsX /></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
