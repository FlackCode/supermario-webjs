import { loadMario } from "./entities/Mario.js"
import { loadGoomba } from "./entities/Goomba.js"
import { loadKoopa } from "./entities/Koopa.js"
import { loadBullet } from "./entities/Bullet.js";
import { loadCannon } from "./entities/Cannon.js";
import { loadFlagPole } from "./entities/FlagPole.js";

export function loadEntities(audioContext) {
    const entityFactories = {};

    function addAs(name) {
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([
        loadMario(audioContext).then(addAs("mario")),
        loadGoomba(audioContext).then(addAs("goomba-brown")),
        loadKoopa(audioContext).then(addAs("koopa-green")),
        loadBullet(audioContext).then(addAs("bullet")),
        loadCannon(audioContext).then(addAs("cannon")),
        loadFlagPole(audioContext).then(addAs("flag-pole")),
    ]).then(() => entityFactories);
}
