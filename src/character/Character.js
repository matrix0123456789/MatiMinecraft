import {Object3D, Vector3} from "three";
import * as THREE from "three";
import {MouseController} from "./controllers/mouseController.js";
import {KeyboardController} from "./controllers/keyboardController.js";
import skyBoxFragmentShader from "../shaders/skybox.fs.glsl";
import skyBoxVertexShader from "../shaders/skybox.vs.glsl";
import WorldData from "../world/worldData.js";

export class Character extends Object3D {
    constructor() {
        super()
        this.speed = new THREE.Vector3(0, 0, 0)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.x = Math.PI / 2
        this.add(this.camera)
        this.controllers = [
            new MouseController(),
            new KeyboardController()
        ]

        this.skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.ShaderMaterial({
            side: THREE.BackSide,
            fragmentShader: skyBoxFragmentShader,
            vertexShader: skyBoxVertexShader
        }))
        this.skyBox.scale.setScalar(1000)
        this.add(this.skyBox)
    }

    tick(deltaTime) {
        this.speed.setX(0)
        this.speed.setY(0)
        for (const controller of this.controllers) {
            this.camera.rotation.x += controller.rotationDifference.x
            this.camera.rotation.y += controller.rotationDifference.y
            this.camera.rotation.z += controller.rotationDifference.z
            this.camera.rotation.order = "ZXY"
            controller.rotationDifference.set(0, 0, 0)

            const speed = 0.01 * deltaTime;
            this.speed.add(controller.movementVector.applyAxisAngle(new Vector3(0,0,1), this.camera.rotation.z).multiplyScalar(speed))
        }
        this.speed.setZ(this.speed.z - 0.0001 * deltaTime);
        const positionPrev = this.position.clone()
        let positionPost = this.position.clone().add(this.speed)
        positionPost = this.testCollisionXMinus(positionPrev, positionPost)
        positionPost = this.testCollisionXPlus(positionPrev, positionPost)
        positionPost = this.testCollisionYMinus(positionPrev, positionPost)
        positionPost = this.testCollisionYPlus(positionPrev, positionPost)
        positionPost = this.testCollisionZMinus(positionPrev, positionPost)
        this.position.copy(positionPost)
    }

    testCollisionZMinus(positionPrev, positionPost) {
        console.log('testCollisionZMinus')
        if (Math.floor(positionPost.z) < Math.floor(positionPrev.z)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.z=0;
                return new THREE.Vector3(positionPost.x, positionPost.y, Math.floor(positionPrev.z))
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionXMinus(positionPrev, positionPost) {
        if (Math.floor(positionPost.x) < Math.floor(positionPrev.x)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.x=0;
                return new THREE.Vector3(Math.floor(positionPrev.x), positionPost.y, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionXPlus(positionPrev, positionPost) {
        if (Math.floor(positionPost.x) > Math.floor(positionPrev.x)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y-0.25), Math.floor(positionPost.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x), Math.floor(positionPost.y+0.25), Math.floor(positionPost.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.x=0;
                return new THREE.Vector3(Math.floor(positionPrev.x), positionPost.y, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionYMinus(positionPrev, positionPost) {
        if (Math.floor(positionPost.y) < Math.floor(positionPrev.y)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.y=0;
                return new THREE.Vector3(positionPost.x, Math.floor(positionPrev.y), positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionYPlus(positionPrev, positionPost) {
        if (Math.floor(positionPost.y) > Math.floor(positionPrev.y)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPost.y), Math.floor(positionPost.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.y=0;
                return new THREE.Vector3(positionPost.x, Math.floor(positionPrev.y), positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
}
