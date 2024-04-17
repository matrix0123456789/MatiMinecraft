import * as THREE from 'three';
export default class Game extends HTMLElement{
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.camera= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
this.appendChild(this.renderer.domElement)

        this. tmpCube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(this.tmpCube);
        this.camera.position.z = 5;

        this.resize()
        addEventListener('resize', () => this.resize())
        this.tick()
    }
    tick(){
        this.tmpCube.rotateX(0.01)
        this.tmpCube.rotateY(0.02)


        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.tick());
    }
    resize(){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

    }
}
customElements.define("game-game",Game)
