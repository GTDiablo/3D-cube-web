import React, {memo} from 'react';
import styles from './style.module.scss';

const Watermark = () => {
    return (
        <div className={styles['Watermark']}>
            <p className={styles['Watermark__text']}>Made by Boda Zsolt</p>
        </div>
    );
};

export default memo(Watermark);
