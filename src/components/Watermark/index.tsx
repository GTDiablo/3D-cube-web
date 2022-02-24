import React, {memo} from 'react';
import styles from './style.module.scss';

const Watermark = () => {
    const handleOnClick = () => {
        window.open('https://github.com/GTDiablo', '_blank');
    }

    return (
        <div className={styles['Watermark']} onClick={handleOnClick}>
            <p className={styles['Watermark__text']}>Made by Boda Zsolt</p>
        </div>
    );
};

export default memo(Watermark);
