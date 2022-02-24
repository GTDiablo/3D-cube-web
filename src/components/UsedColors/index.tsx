import React, {FC, memo} from 'react';
import classNames from "classnames";
import styles from './style.module.scss'

type Props = {
    onColorClicked: (color: string) => void;
    colors: string[];
    className?: string
}

const UsedColors: FC<Props> = ({onColorClicked,colors, className=''}) => {
    const localColors: string[] = ['#ffffff', '#000000', ...colors];

    const renderColors = () => {
        return localColors.map((color: string)=> (
            <div
                className={styles['UsedColors__box']}
                key={color}
                style={{backgroundColor: color}}
                onClick={()=> onColorClicked(color)}
            />
        ));
    };
    return (
        <div className={classNames(styles['UsedColors'], className)}>
            {renderColors()}
        </div>
    );
};

export default memo(UsedColors);
