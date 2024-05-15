import * as THREE from 'three';
import {World} from "./world/world.js";
import {Character} from "./character/Character.js";

/**
 * kolory tła
 * //#83afff
 * const vec4 color1=vec4(0.5137254901960784,0.6862745098039216,1.0,1.0);
 * //#acd2ff
 * const vec4 color2=vec4(0.6745098039215687,0.8235294117647058,1.0,1.0);
 * //#054c7f
 * const vec4 color3=vec4(0.0196078431372549,0.2980392156862745,0.4980392156862745,1.0);
 */
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
        this.lastTick = new Date();
        this.tick()
    }

    tick() {
        const date = new Date();
        let deltaTime = date - this.lastTick;
        if(deltaTime>100){
            deltaTime = 100;
        }
        this.lastTick = date;
        for(let i=0; i<deltaTime; i++) {
            this.character.tick(1)

            this.tmpCube.rotateX(0.01)
            this.tmpCube.rotateY(0.02)

            this.character.tick(1);

            this.world.tick(this.character.position)
        }
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
