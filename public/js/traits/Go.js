import Trait from "../Trait.js";
import Jump from "./Jump.js";

export default class Go extends Trait {
    constructor() {
        super();

        this.dir = 0;
        this.acceleration = 400;
        this.deceleration = 300;
        this.dragFactor = 1/5000;
        this.distance = 0;
        this.heading = 1;
    }

    update(entity, {deltaTime}) {
        const absX = Math.abs(entity.vel.x);
        if (this.dir !== 0) {
            entity.vel.x += this.acceleration * deltaTime * this.dir;
            if (entity.traits.has(Jump)) {
                if (entity.traits.get(Jump).falling === false) {
                    this.heading = this.dir;
                }
            } else {
                this.heading = this.dir;
            }
        } else if (entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel;
        } else {
            this.distance = 0;
        }
        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;
        this.distance += absX * deltaTime;
    }
}
