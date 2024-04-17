import {Euler, Vector3} from "three";

export class MouseController {
    rotationDifference = new Euler()

    constructor() {
        addEventListener("mousemove", (event) => {
            this.rotationDifference.z -= event.movementX / innerWidth;
            this.rotationDifference.x -= event.movementY / innerHeight;
        });
        addEventListener("click", e => {
            document.body.requestPointerLock()
        })
    }

    get movementVector() {
        return new Vector3(0, 0, 0)
    }
}
