import WorldData from "./worldData.js";
import {Chunk3d} from "./chunk3d.js";
import * as THREE from 'three';

export class World extends THREE.Object3D{
    constructor() {
        super();

        const tmpChunk=new Chunk3d(WorldData.getChunk(0,0))
        this.add(tmpChunk)
    }
}
