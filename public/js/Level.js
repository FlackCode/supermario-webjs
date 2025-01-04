import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import TileCollider from "./TileCollider.js";
import Camera from "./Camera.js";
import { findPlayers } from "./player.js";
import Scene from "./Scene.js"
function focusPlayer(level) {
    for (const player of findPlayers(level)) {
        level.camera.pos.x = Math.max(0, player.pos.x - 100);
    }
}

export default class Level extends Scene {
    constructor() {
        super();
        this.gravity = 1500;
        this.totalTime = 0;
        this.name = "";
        this.camera = new Camera();
        this.music = new MusicController();
        this.entities = new Set();
        this.tileCollider = new TileCollider();
        this.entityCollider = new EntityCollider(this.entities);
    }

    draw({videoContext}) {
        this.comp.draw(videoContext, this.camera);
    }

    update(gameContext) {
        this.entities.forEach(entity => {
            entity.update(gameContext, this);
            
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        this.entities.forEach(entity => {
            entity.finalize();
        });

        focusPlayer(this);

        this.totalTime += gameContext.deltaTime;
    }

    pause() {
        this.music.pause();
    }
}
