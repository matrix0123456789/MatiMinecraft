import * as THREE from 'three';
import {World} from "./world/world.js";
import {Character} from "./character/Character.js";

export default class Game extends HTMLElement {
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.world = new World();
        this.character = new Character();
        this.scene.add(this.world)
        this.scene.add(this.character)
        this.renderer = new THREE.WebGLRenderer();
        this.appendChild(this.renderer.domElement)
        this.character.position.z = 7
        this.character.position.x = 5
        this.character.position.y = 5
        this.tmpCube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(this.tmpCube);

        this.resize()
        addEventListener('resize', () => this.resize())
        this.lastTick=new Date();
        this.tick()
    }

    tick() {
        const date=new Date();
        const deltaTime=date-this.lastTick;
        this.lastTick=date;
        this.tmpCube.rotateX(0.01)
        this.tmpCube.rotateY(0.02)

        this.character.tick(deltaTime);
        this.renderer.render(this.scene, this.character.camera);
        requestAnimationFrame(() => this.tick());
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.character.camera.aspect = window.innerWidth / window.innerHeight;
        this.character.camera.updateProjectionMatrix();

    }
}
customElements.define("game-game", Game)
