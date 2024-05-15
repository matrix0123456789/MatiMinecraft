import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const texturePromise = new Promise((resolve, reject) => {
    const texture = textureLoader.load('terrain.png', resolve);
});

export class Chunk3d extends THREE.Object3D {
    constructor(chunkData) {
        super();
        this.chunkData = chunkData;
        this.generate();

    }

    generate() {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    const chunkType = this.chunkData[x * 16 * 16 + y * 16 + z];
                    if (chunkType > 0) {
                        const material = new THREE.MeshStandardMaterial({});
                        const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
                        cube.position.set(x+.5, y+.5, z+.5);
                        cube.castShadow = true;
                        cube.receiveShadow = true;

                        material.emissive.set(0, 0, 0)
                        texturePromise.then(texture => {
                            console.log('ddddd')
                            texture.repeat.x = 1 / 16
                            texture.repeat.y = 1 / 16
                            texture.offset.x = 2 / 16
                            texture.offset.y = 15 / 16
                            texture.magFilter = THREE.NearestFilter;
                            texture.minFilter = THREE.NearestFilter;

                            material.map = texture;
                            material.needsUpdate = true;
                            material.color.set(1, 1, 1)
                        });
                        this.add(cube);
                    }
                }
            }
        }
    }
}
