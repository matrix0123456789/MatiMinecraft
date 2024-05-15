import {Object3D, Vector3} from "three";
import * as THREE from "three";
import {MouseController} from "./controllers/mouseController.js";
import {KeyboardController} from "./controllers/keyboardController.js";
import skyBoxFragmentShader from "../shaders/skybox.fs.glsl";
import skyBoxVertexShader from "../shaders/skybox.vs.glsl";
import WorldData from "../world/worldData.js";

export class Character extends Object3D {
    equipment=[]
    constructor(game) {
        super()
        this.game= game
        this.speed = new THREE.Vector3(0, 0, 0)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.x = Math.PI / 2
        this.camera.position.z=1.8
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

            const speed = 0.001 * deltaTime;
            const deltaVector=controller.movementVector.applyAxisAngle(new Vector3(0,0,1), this.camera.rotation.z).multiplyScalar(speed);
            if(this.speed.z==0&&deltaVector.z!=0){
                this.speed.z=0.005;
            }
            deltaVector.z=0;
            this.speed.add(deltaVector)
        }
        this.speed.setZ(this.speed.z - 9.81*deltaTime/1000/1000);
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
        if (Math.floor(positionPost.z) < Math.floor(positionPrev.z)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPost.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPost.z))
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
        if (Math.floor(positionPost.x-0.25) < Math.floor(positionPrev.x-0.25)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x-0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.x=0;
                return new THREE.Vector3(Math.floor(positionPrev.x-0.25)+0.25, positionPost.y, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionXPlus(positionPrev, positionPost) {
        if (Math.ceil(positionPost.x+0.25) > Math.ceil(positionPrev.x+0.25)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y-0.25), Math.floor(positionPrev.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPost.x+0.25), Math.floor(positionPrev.y+0.25), Math.floor(positionPrev.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.x=0;
                return new THREE.Vector3(Math.ceil(positionPrev.x+0.25)-0.2501, positionPost.y, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionYMinus(positionPrev, positionPost) {
        if (Math.floor(positionPost.y-0.25) < Math.floor(positionPrev.y-0.25)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y-0.25), Math.floor(positionPrev.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.y=0;
                return new THREE.Vector3(positionPost.x, Math.floor(positionPrev.y-0.25)+0.25, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }
    testCollisionYPlus(positionPrev, positionPost) {
        if (Math.ceil(positionPost.y+0.25) > Math.ceil(positionPrev.y+0.25)) {
            const blocks = [
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z)),
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z+1)),
                WorldData.getOneBlock(Math.floor(positionPrev.x-0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z+1.8)),
                WorldData.getOneBlock(Math.floor(positionPrev.x+0.25), Math.floor(positionPost.y+0.25), Math.floor(positionPrev.z+1.8))
            ]
            if (blocks.some(x=>x>0)) {
                this.speed.y=0;
                return new THREE.Vector3(positionPost.x, Math.ceil(positionPrev.y+0.25)-0.2501, positionPost.z)
            } else {
                return positionPost
            }
        } else {
            return positionPost
        }
    }

    addBlockToEquipment(deletedBlock) {
        let finded=false;
        for(let i=0;i<this.equipment.length; i++){
            if(this.equipment[i].type==deletedBlock && this.equipment[i].count<64){
                this.equipment[i].count++;
                finded=true;
                break;
            }
        }
        if(!finded) {
            this.equipment.push({type: deletedBlock, count: 1})
        }
        this.game.gui.refreshEquipment(this.equipment)
    }

    pullBlockFromEquipment() {
        if(this.equipment[0] && this.equipment[0].count>0){
            this.equipment[0].count--;
            this.game.gui.refreshEquipment(this.equipment)
            return this.equipment[0].type;
        }
    }
}
