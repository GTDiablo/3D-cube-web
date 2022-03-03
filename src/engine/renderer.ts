import Cube from "../core/cube";
import { Node } from '../core/types';
//
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type NodeClickCallback = (node: Node| null) => void;

class CubeRenderer {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private raycaster: THREE.Raycaster;
    private readonly mouse: THREE.Vector2;
    private readonly mesh: THREE.InstancedMesh;
    private callbacks: NodeClickCallback[] = [];

    constructor(
        private canvasEl: HTMLCanvasElement | null,
        private cube: Cube,
    ) {
        const cubeSize = cube.getSize();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(1, 1);
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, cubeSize, 10)
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasEl as HTMLCanvasElement
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio( window.devicePixelRatio );

        const gridHelper = new THREE.GridHelper(200, 50);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;

        const light = new THREE.HemisphereLight( 0xffffff, 0x888888 );
        light.position.set( 0, 1, 0 );

        const count = Math.pow(this.cube.getSize(), 3);
        this.mesh = new THREE.InstancedMesh(
            new THREE.SphereGeometry(0.3),
            new THREE.MeshPhongMaterial({color: 0xffffff}),
            count
        );

        const offset = (this.cube.getSize() -1) / 2;

        const matrix = new THREE.Matrix4();
        this.cube.getNodes().forEach((node: Node, index:number)=> {
            const [x, y, z] = Object.values(node.point).map((n: number)=> n);
            matrix.setPosition(offset - x, offset - y, offset - z);
            this.mesh.setMatrixAt(index, matrix);
            this.mesh.setColorAt(index, this.hexColorToThreeJsColor(node.color));
        });

        // Rotate cube
        this.mesh.rotateZ(3.1415926536)
        this.mesh.translateY(-2.7);

        this.scene.add(this.mesh, gridHelper, light);

        // Render helper arrows
        const arrowPos = new THREE.Vector3( -5,0,5 );
        this.scene.add( new THREE.ArrowHelper( new THREE.Vector3( 1,0,0 ), arrowPos, 10, 0x7F2020, 1, 1 ) ); // Red - X
        this.scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,1,0 ), arrowPos, 10, 0x207F20, 1, 1 ) ); // Green - Y
        this.scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,0,-1 ), arrowPos, 10, 0x20207F, 1, 1 ) ); // Blue - Z

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );
        document.addEventListener( 'mousemove', this.onMouseMove.bind(this) );
        document.addEventListener('click', this.handleOnClick.bind(this));
    }

    private handleOnClick(event: any){
        event.preventDefault();

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersection = this.raycaster.intersectObject(this.mesh);
        if(intersection.length > 0){
            const index = intersection[0].instanceId
            // @ts-ignore
            const selectedNode = this.cube.getNodes()[index];
            // console.log('Clicked:', selectedNode);
            this.publishClick(selectedNode);

        }
    }

    private hexColorToThreeJsColor(hexColor: string): THREE.Color {
        return new THREE.Color().setHex(eval(hexColor.replace('#', '0x')));
    }

    animate(): void {
        this.render();
        this.controls.update();
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.cube.getNodes().forEach((node: Node, index:number)=> {
            this.mesh.setColorAt(index, this.hexColorToThreeJsColor(node.color));
            // @ts-ignore
            this.mesh.instanceColor.needsUpdate = true;
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event: MouseEvent){
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 -1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 +1;
    }

    onNodeClick(callback: NodeClickCallback): void {
        this.callbacks.push(callback);
    }

    publishClick(node: Node | null): void {
        this.callbacks.forEach((callback: NodeClickCallback)=> callback(node));
    }


}
export default CubeRenderer;
