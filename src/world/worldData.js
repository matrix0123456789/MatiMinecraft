export default {
    chunks: new Map(),
    getChunk(x, y) {
        if (!this.chunks.has(x)) {
            this.chunks.set(x, new Map())
        }
        if (!this.chunks.get(x).has(y)) {
            this.chunks.get(x).set(y, this.generateChunk(x, y))
        }
        return this.chunks.get(x).get(y)
    },
    getOneBlock(x, y, z) {
        if(z>=16){
            return 0
        }
        const chunkX = Math.floor(x / 16)
        const chunkY = Math.floor(y / 16)
        const chunk = this.getChunk(chunkX, chunkY)
        return chunk[(x % 16) * 16 * 16 + (y % 16) * 16 + (z % 16)]
    },
    generateChunk(cx, cy) {
        const ret = [];
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    if (z <= 5) {
                        ret.push(1)
                    } else if (z == 6) {
                        ret.push(Math.random() > 0.5 ? 1 : 0)
                    } else {
                        ret.push(0)
                    }
                }
            }
        }
        return ret;
    }
}
