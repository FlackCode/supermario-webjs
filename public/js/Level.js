import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import TileCollider from "./TileCollider.js";
export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;

        this.music = new MusicController();
        this.events = new EventEmitter();
        this.comp = new Compositor();
        this.entities = new Set();
        this.tileCollider = new TileCollider();
        this.entityCollider = new EntityCollider(this.entities);
    }

    update(gameContext) {
        this.entities.forEach(entity => {
            entity.update(gameContext, this);
            
        })

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        })

        this.entities.forEach(entity => {
            entity.finalize();
        })

        this.totalTime += gameContext.deltaTime;
    }
}
