import Cube from "../../core/cube";
import { Node } from '../../core/types';
import CubeRenderer from "../../engine/renderer";
//
import React, { FC, useRef, useEffect, memo } from 'react';
import classNames from "classnames";
//
import styles from './style.module.scss';

type Props = {
    className?: string;
    cube: Cube | null;
    setCurrentNode: (node: Node | null) => void;
};

const EngineWindow: FC<Props> = ({className,cube, setCurrentNode}) => {
    const canvasElRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(()=> {
        if(!!cube){
            const cubeRenderer = new CubeRenderer(canvasElRef.current, cube);
            cubeRenderer.onNodeClick((node: Node)=> {
                setCurrentNode(node);
            })
            cubeRenderer.animate();
        }
    },[cube])

    return (
        <div className={classNames(className, styles['EngineWindow'])}>
            <canvas id="canvas" ref={canvasElRef}/>
        </div>
    );
};

export default memo(EngineWindow);
