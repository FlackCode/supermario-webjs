import { Sides, Trait } from "../Entity.js";

export default class Emitter extends Trait {
    constructor() {
        super("emitter");
        this.interval = 2;
        this.cooldown = this.interval;
        this.emitters = [];
    }

    emit(entity, level) {
        for (const emitter of this.emitters) {
            emitter(entity, level);
        }
    }

    update(entity, {deltaTime}, level) {
        this.cooldown -= deltaTime;
        if (this.cooldown <= 0) {
            this.emit(entity, level);
            this.cooldown = this.interval;
        }
    }
}
