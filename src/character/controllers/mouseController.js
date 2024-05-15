import {Euler, Vector3} from "three";

export class MouseController {
    rotationDifference = new Euler()
    isLeftButtonPressed = false;
    isRightButtonPressed = false;

    constructor() {
        addEventListener("mousemove", (event) => {
            this.rotationDifference.z -= event.movementX / innerWidth;
            this.rotationDifference.x -= event.movementY / innerHeight;
        });
        addEventListener("click", e => {
            document.body.requestPointerLock()
        })
        addEventListener("mousedown", e => {
            e.preventDefault()
            if (e.button == 2) {
                this.isRightButtonPressed = true;
            } else if (e.button == 0) {
                this.isLeftButtonPressed = true;
            }
        })
    }

    get movementVector() {
        return new Vector3(0, 0, 0)
    }
}
