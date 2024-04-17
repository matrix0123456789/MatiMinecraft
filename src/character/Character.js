import {Object3D} from "three";
import * as THREE from "three";
import {MouseController} from "./controllers/mouseController.js";
import {KeyboardController} from "./controllers/keyboardController.js";

export class Character extends Object3D {
    constructor() {
        super()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.x = Math.PI / 2
        this.add(this.camera)
        this.controllers = [
            new MouseController(),
            new KeyboardController()
        ]
    }

    tick(deltaTime) {
        for (const constroller of this.controllers) {
            this.camera.rotation.x += constroller.rotationDifference.x
            this.camera.rotation.y += constroller.rotationDifference.y
            this.camera.rotation.z += constroller.rotationDifference.z
            this.camera.rotation.order = "ZXY"
            constroller.rotationDifference.set(0, 0, 0)

            const speed = 0.01 * deltaTime;
            this.position.add(constroller.movementVector.multiplyScalar(speed))
        }
    }
}
