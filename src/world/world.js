import WorldData from "./worldData.js";
import {Chunk3d} from "./chunk3d.js";
import * as THREE from 'three';

export class World extends THREE.Object3D {
    chunksMap = new Map();
    constructor() {
        super();

        this.hemiLight = new THREE.HemisphereLight(0xddddff, 0x444444);
        this.hemiLight.position.set(0, 0, 100);
        this.add(this.hemiLight);

        this.sunLight = new THREE.DirectionalLight(0xffffdd);
        this.sunLight.position.set(30, 50, 100);
        this.sunLight.castShadow= true;
        this.add(this.sunLight);
    }
    tick(characterPosition){
        const chunkX = Math.floor(characterPosition.x / 16)
        const chunkY = Math.floor(characterPosition.y / 16)
        for(let ix=-1; ix<=1; ix++) {
            for (let iy = -1; iy <= 1; iy++) {

                if (!this.chunksMap.has(chunkX+ix)) {
                    this.chunksMap.set(chunkX+ix, new Map())
                }
                if (!this.chunksMap.get(chunkX+ix).has(chunkY+iy)) {
                    const newChunk = new Chunk3d(WorldData.getChunk(chunkX+ix, chunkY+iy))
                    newChunk.position.set((chunkX+ix) * 16, (chunkY+iy) * 16, 0)
                    this.chunksMap.get(chunkX+ix).set(chunkY+iy, newChunk)
                    this.add(newChunk)
                }
            }
        }
    }
}
