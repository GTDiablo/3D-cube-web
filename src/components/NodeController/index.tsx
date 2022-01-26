import {Node} from "../../core/types";
//
import React, {FC, useEffect, useState, memo} from 'react';
import classNames from "classnames";
import { HexColorPicker } from "react-colorful";
//
import styles from './style.module.scss';

type Props = {
    className?: string;
    node : Node;
    setCurrentNodeColor: (node: Node, color: string) => void
};

const NodeController: FC<Props> = ({ className, node , setCurrentNodeColor})  => {
    const [color, setColor] = useState<string>(node.color);

    useEffect(()=> {
        setColor(node.color);
    }, [node]);

    const onColorChange = (newColor: string) => {
        setColor(newColor)
        setCurrentNodeColor(node, newColor);
    }


    return (
        <div className={classNames(className, styles['NodeController'])}>
            <div className={styles["NodeController__point-info"]}>
                {Object.entries(node.point).map(([key, value])=> (
                    <div key={key} className={styles["NodeController__point-info__point"]}>{key}: {value}</div>
                ))}
            </div>
            <HexColorPicker
                className={styles["NodeController__color-input"]}
                color={color}
                onChange={(newColor)=> onColorChange(newColor)}
            />
        </div>
    );
};

export default memo(NodeController);
