import {Euler, Vector3} from "three";

export class KeyboardController {
    pressedKeys = new Set()
    rotationDifference = new Euler()

    constructor() {
        addEventListener('keydown', e => {
            this.pressedKeys.add(e.key)
        })
        addEventListener('keyup', e => {
            this.pressedKeys.delete(e.key)
        })
    }

    get movementVector() {
        const ret = new Vector3(0, 0, 0);
        if (this.pressedKeys.has('w')) {
            ret.y += 1
        } else if (this.pressedKeys.has('s')) {
            ret.y -= 1
        }
        if (this.pressedKeys.has('a')) {
            ret.x -= 1
        } else if (this.pressedKeys.has('d')) {
            ret.x += 1
        }

        return ret;
    }
}
