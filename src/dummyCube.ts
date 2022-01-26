import {Node} from "./core/types";

const DUMMY_CUBE_SIZE: number = 6;
const DUMMY_CUBE_NODE_COLOR: string = '#ffffff';
const USE_RANDOM_NODE_COLOR: boolean = false;

const generateRandomHexColor = (): string => `#${Math.floor(Math.random()*16777215).toString(16)}`;

const generateDummyCubeNodes = (size: number): Node[] => {
    const nodes: Node[] = []

    for(let x=0; x<size; x++){
        for(let y=0; y<size; y++){
            for(let z=0; z<size; z++){
                nodes.push({
                    point: { x, y, z },
                    color: USE_RANDOM_NODE_COLOR ? generateRandomHexColor() : DUMMY_CUBE_NODE_COLOR
                })
            }
        }
    }

    return nodes;
}

const generateDummyCubeObject = (size: number) => {
    const nodes: Node[] = generateDummyCubeNodes(size);
    return { size, nodes }
}

export default generateDummyCubeObject(DUMMY_CUBE_SIZE);
