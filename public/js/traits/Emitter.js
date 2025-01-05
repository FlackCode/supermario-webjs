import Trait from "../Trait.js";

export default class Emitter extends Trait {
    constructor() {
        super();
        this.interval = 2;
        this.cooldown = this.interval;
        this.emitters = [];
    }

    emit(entity, gameContext, level) {
        for (const emitter of this.emitters) {
            emitter(entity, gameContext, level);
        }
    }

    update(entity, gameContext, level) {
        const {deltaTime} = gameContext;
        this.cooldown -= deltaTime;
        if (this.cooldown <= 0) {
            this.emit(entity, gameContext, level);
            this.cooldown = this.interval;
        }
    }
}
