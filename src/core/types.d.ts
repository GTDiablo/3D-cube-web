import Cube from "./cube";

export type Point = {
  x: number;
  y: number;
  z: number;
};

export type Color = string;

export type Node = {
    point: Point;
    color: Color;
}

export interface ICubeSerializer {
    serialize: (cube: Cube) => string;
    deserialize: (size: number, data: string) => Cube;
}
