import WorldData from "./worldData.js";
import {Chunk3d} from "./chunk3d.js";
import * as THREE from 'three';

export class World extends THREE.Object3D {
    constructor() {
        super();

        const tmpChunk = new Chunk3d(WorldData.getChunk(0, 0))
        this.add(tmpChunk)

        this.hemiLight = new THREE.HemisphereLight(0xddddff, 0x444444);
        this.hemiLight.position.set(0, 0, 100);
        this.add(this.hemiLight);

        this.sunLight = new THREE.DirectionalLight(0xffffdd);
        this.sunLight.position.set(30, 50, 100);
        this.sunLight.castShadow= true;
        this.add(this.sunLight);
    }
}
