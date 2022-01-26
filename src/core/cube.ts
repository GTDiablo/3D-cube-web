import { Point, Node, Color} from "./types";

type CubeCallback = (node: Node, cube: Cube) => void;

class Cube {
    private data = new Map<string, Node>();
    private callbacks: CubeCallback[] = [];

    constructor(
        private size: number
    ) {}

    public setNode(point: Point, color: Color): void {
        if(!this.doesPointExists(point)){
            return;
        }

        const node: Node = Cube.createNode(point, color);
        this.data.set(Cube.pointToHash(point), node);

        this.publishChange(node, this);
    }

    public getNode(point: Point): Node {
        if(!this.doesPointExists(point)){
            throw new Error(`Point is out of size of ${this.getSize()}`);
        }

        return this.data.get(Cube.pointToHash(point)) as Node;
    }

    public getSize(): number {
        return this.size;
    }

    public getNodeCount(): number {
        return Math.pow(this.size, 3);
    }

    public doesPointExists(point: Point): boolean {
        return Object.values(point).every((n: number)=> n > -1 && n < this.size);
    }

    public getNodes(): Node[]{
        return [...this.data.values()];
    }

    public setNodes(nodes: Node[]): Cube {
        if(!nodes.every((node: Node)=> this.doesPointExists(node.point))){
            throw new Error('Could not create cube with given nodes.');
        }

        nodes.forEach((node: Node)=> this.setNode(node.point, node.color));
        return this;
    }

    private static pointToHash(point: Point): string {
        return JSON.stringify(point);
    }

    private static createNode(point: Point, color: Color): Node {
        return {point, color};
    }

    public onChange(cb: CubeCallback): void {
        this.callbacks.push(cb);
    }

    private publishChange(node: Node, cube: Cube): void {
        this.callbacks.forEach((cb: CubeCallback)=> cb(node, cube));
    }

}

export default Cube;
