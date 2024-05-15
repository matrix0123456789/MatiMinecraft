import * as THREE from 'three';
import {World} from "./world/world.js";
import {Character} from "./character/Character.js";
import {GUI} from "./GUI.js";

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
        this.character = new Character(this);
        this.scene.add(this.world)
        this.scene.add(this.character)
        this.renderer = new THREE.WebGLRenderer();
        this.appendChild(this.renderer.domElement)
        this.character.position.z = 7
        this.character.position.x = 5
        this.character.position.y = 5
        this.tmpCube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(this.tmpCube);
        this.gui = new GUI();
        this.appendChild(this.gui);

        this.resize()
        addEventListener('resize', () => this.resize())
        this.lastTick = new Date();
        this.tick()
    }

    tick() {
        const date = new Date();
        let deltaTime = date - this.lastTick;
        if (deltaTime > 100) {
            deltaTime = 100;
        }
        this.lastTick = date;
        for (let i = 0; i < deltaTime; i++) {
            this.character.tick(1)

            this.tmpCube.rotateX(0.01)
            this.tmpCube.rotateY(0.02)

            this.character.tick(1);

            this.world.tick(this.character.position)

            this.checkActions();

        }
        this.renderer.render(this.scene, this.character.camera);
        requestAnimationFrame(() => this.tick());
    }

    checkActions() {
        if (this.character.controllers.some(c => c.isLeftButtonPressed)) {
            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(0, 0), this.character.camera);
            const intersectedObject = rayCaster.intersectObject(this.scene, true)[0];
            if (intersectedObject && intersectedObject.distance < 3) {
                console.log(intersectedObject);
                const deletedBlock = this.world.deleteBlock(Math.floor(intersectedObject.object.position.x), Math.floor(intersectedObject.object.position.y), Math.floor(intersectedObject.object.position.z));
                this.character.addBlockToEquipment(deletedBlock);
            }
            this.character.controllers.forEach(c => c.isLeftButtonPressed = false);
        }

        if (this.character.controllers.some(c => c.isRightButtonPressed)) {
            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(0, 0), this.character.camera);
            const intersectedObject = rayCaster.intersectObject(this.scene, true)[0];
            if (intersectedObject && intersectedObject.distance < 3) {
            const block=this.character.pullBlockFromEquipment();
            this.world.putBlock(block, Math.floor(intersectedObject.point.x), Math.floor(intersectedObject.point.y), Math.floor(intersectedObject.point.z)+1);
            }
            this.character.controllers.forEach(c => c.isRightButtonPressed = false);
        }
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.character.camera.aspect = window.innerWidth / window.innerHeight;
        this.character.camera.updateProjectionMatrix();

    }
}
customElements.define("game-game", Game)
