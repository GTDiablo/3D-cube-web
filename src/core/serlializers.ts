import Cube from "./cube";
import { ICubeSerializer, Node } from "./types";

class CubeSerializer implements ICubeSerializer {

    deserialize(size: number, data: string): Cube {
        let nodes: Node[] = JSON.parse(data);

        if(size < 1 && nodes.length !== Math.pow(size, 3)){
            throw new Error('Could not deserialize data.');
        }

        return new Cube(size).setNodes(nodes);
    }

    serialize(cube: Cube): string {
        const nodes: Node[] = cube.getNodes();
        return JSON.stringify(nodes);
    }

}

export default CubeSerializer;
