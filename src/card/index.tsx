import React from 'react';
import * as styles from './card.module.scss';

interface Props {
  children: React.children;
  placeholder: Boolean;
  button: Boolean;
}

export const Card = ({
  placeholder = false,
  button = false,
  vertical = false,
  children
}: Props) => {
  return (
    <div className={`${styles.card} ${placeholder ? styles['card-placeholder'] : ''} ${button ? styles['card-button'] : ''} ${vertical ? styles['card-vertical'] : ''}`}>
      <div className={styles['card-content']}>
        {children}
      </div>
    </div>
  );
};
