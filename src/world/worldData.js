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
    generateChunk(cx, cy) {
        const ret = [];
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    if (z<=5) {
                        ret.push(1)
                    } else {
                        ret.push(0)
                    }
                }
            }
        }
        return ret;
    }
}
