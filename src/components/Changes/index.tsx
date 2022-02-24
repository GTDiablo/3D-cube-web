import React, {FC, memo} from 'react';
import { Node } from "../../core/types";
import styles from './style.module.scss'
import classNames from "classnames";

type Props = {
    changes: Node[];
    sendChanges: () => void;
    className?: string;
};

const Changes: FC<Props> = ({changes, sendChanges, className=''}) => {

    return (
        <div className={classNames(styles['Changes'], className)}>
            <button
                className={styles['Changes__button']}
                onClick={sendChanges}>
                Send Changes
            </button>
            <div className={styles['Changes__changes']}>
                {changes.map((node: Node, index: number)=> (
                    <div
                        className={styles['Changes__change-item']}
                        key={index}
                    >
                        {Object.entries(node.point).map(([key, value])=> (
                            <div key={key} className={styles["Changes__change-item__point"]}>{key}: {value}</div>
                        ))}
                        <div className={styles['Changes__change-item__color']} style={{backgroundColor: node.color}}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(Changes);
