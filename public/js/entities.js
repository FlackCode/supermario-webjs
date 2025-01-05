import { loadMario } from "./entities/Mario.js"
import { loadGoomba } from "./entities/Goomba.js"
import { loadKoopa } from "./entities/Koopa.js"
import { loadBullet } from "./entities/Bullet.js";
import { loadCannon } from "./entities/Cannon.js";
import { loadFlagPole } from "./entities/FlagPole.js";

function createPool(size) {
    const pool = [];

    return function createPooledFactory(factory) {
        for (let i = 0; i < size; i++) {
            pool.push(factory());
        }

        let count = 0;
        return function pooledFactory() {
            const entity = pool[count++ % pool.length];
            entity.lifetime = 0;
            return entity;
        }
    }
}

export async function loadEntities(audioContext) {
    const entityFactories = {};

    function setup(loader) {
        return loader(audioContext);
    }

    function addAs(name) {
        return factory => entityFactories[name] = factory;
    }

    await Promise.all([
        setup(loadMario).then(addAs("mario")),
        setup(loadGoomba).then(addAs("goomba-brown")),
        setup(loadKoopa).then(addAs("koopa-green")),
        setup(loadBullet).then(addAs("bullet")),
        setup(loadCannon).then(addAs("cannon")),
        setup(loadFlagPole).then(addAs("flag-pole"))
    ]);

    return entityFactories;
}
