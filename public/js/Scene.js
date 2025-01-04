import Compositor from "./Compositor.js";
import EventEmitter from "./EventEmitter.js";

export default class Scene {
    static EVENT_COMPLETE = Symbol("scene complete");

    constructor() {
        this.events = new EventEmitter();
        this.comp = new Compositor();
        this.countDown = 2;
    }

    draw({videoContext}) {
        this.comp.draw(videoContext);
    }

    update(gameContext) {
        
    }

    pause() {
        
    }
}
